"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { Prisma } from "@prisma/client";
import { iPay, IPAY_PAYMENT_ACCOUNT_IDENTIFIER } from "@/config/iremboConfig";
import { getSessionUser } from "@/server-actions/user.actions";
import { createClientRecord, updateClientPhone } from "@/lib/server/accounts";
import {
     cancelOpenTransaction, failReservation, invoiceExpiryFrom, invoiceRemainingMs,
     REUSE_MIN_REMAINING_MS, syncIremboTransaction,
} from "@/lib/server/payments";
import { getAuthContext } from "@/lib/auth-guard";
import { USD_TO_RWF_RATE } from "@/common/CommonTypes";
import { RevalidatePages } from "@/services/Server";

type TCreateInvoiceResult = {
     error?: string;
     /** Not a failure — another payment request is mid-flight; the client should simply retry shortly. */
     busy?: string;
     invoiceNumber?: string;
     paymentLinkUrl?: string;
     amount?: number;
     alreadyPaid?: boolean;
     /** Set when the client's existing open invoice was reopened instead of creating a new one. */
     resumedFrom?: Date;
     /** How many earlier unpaid invoices were closed (so they can no longer be paid). */
     closedPrevious?: number;
};

const isUniqueViolation = (error: unknown) => error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

/**
 * Starts (or resumes) a subscription payment. A client never has more than one open IremboPay
 * invoice: an existing open invoice for the same plan and amount is handed back instead of
 * creating a new one, and any other open invoices are verified with IremboPay and closed first.
 */
export async function createSubscriptionInvoice(subscriptionId: number, phone?: string): Promise<TCreateInvoiceResult> {
     const { user } = await getSessionUser();
     if (!user) return { error: "Not authenticated" };

     const plan = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
     if (!plan || !plan.isActive) return { error: "Subscription plan not found" };
     if (!plan.iremboProductCode) return { error: "This plan is not yet configured for payment" };

     // Google sign-ups get a Client row auto-created with phone:"" (see auth/login/layout.tsx) —
     // so `user.client` alone isn't proof of a usable phone. Persist a freshly-given phone onto
     // that existing client rather than silently discarding it because `user.client` was truthy.
     let client: { id: number; name: string; phone: string } | null = user.client;
     if (!client || !client.phone) {
          if (!phone) return { error: "A phone number is required to subscribe" };
          try {
               client = client
                    ? await updateClientPhone(client.id, phone)
                    : await createClientRecord({ name: user.email, phone, userId: user.id });
          } catch (error) {
               unstable_rethrow(error);
               console.log("Error saving client phone:", error);
               client = null;
          }
     }
     if (!client) return { error: "A phone number is required to subscribe" };

     const rwfAmount = plan.currency === "RWF" ? plan.price : Math.round(plan.price * USD_TO_RWF_RATE);

     // The plan on ClientSubscription is only switched when a payment for a new plan is confirmed.
     const clientSub = await prisma.clientSubscription.upsert({
          where: { clientId: client.id },
          create: { expiryAt: null, client: { connect: { id: client.id } }, subscription: { connect: { id: plan.id } } },
          update: {},
          select: { id: true },
     });

     // 1. Settle every open IremboPay payment this client has (legacy data may hold several).
     const open = await prisma.transaction.findMany({
          where: { clientSubscriptionId: clientSub.id, provider: "IREMBO_PAY", transactionStatus: "PENDING" },
          orderBy: { createdAt: "desc" },
     });
     let closedPrevious = 0;
     const stillOpen: { tx: (typeof open)[number]; invoice: Awaited<ReturnType<typeof syncIremboTransaction>>["invoice"] }[] = [];
     for (const tx of open) {
          const r = await syncIremboTransaction(tx);
          if (r.state === "PAID") {
               RevalidatePages.clientSubscription();
               return { alreadyPaid: true };
          }
          if (r.state === "PARTIALLY_PAID") return { error: "A previous payment was only partially completed. Please contact us so we can resolve it." };
          // Never open a second invoice while we can't confirm the first one is unpaid.
          if (r.state === "ERROR") return { error: "We couldn't verify your previous payment with IremboPay. Please try again in a moment." };
          if (r.state === "PENDING") stillOpen.push({ tx, invoice: r.invoice });
          else if (r.state === "CANCELLED" && tx.invoiceNumber) closedPrevious++;
     }

     // 2. Keep the newest open invoice if it's for this plan/amount and still has time left; close the rest.
     let keep: (typeof stillOpen)[number] | null = null;
     for (const item of stillOpen) {
          const { tx, invoice } = item;
          if (!tx.invoiceNumber) {
               // Another request is creating this invoice right now.
               return { busy: "Your payment is still being prepared. Please wait a few seconds and try again — you will not be charged twice." };
          }
          const samePlan = (tx.subscriptionId === null || tx.subscriptionId === plan.id) && tx.amount === rwfAmount;
          if (!keep && samePlan && invoiceRemainingMs(tx, invoice) >= REUSE_MIN_REMAINING_MS) {
               keep = item;
          } else {
               await cancelOpenTransaction({ id: tx.id, invoiceNumber: tx.invoiceNumber }, invoice);
               closedPrevious++;
          }
     }

     if (keep?.tx.invoiceNumber) {
          // Legacy rows don't hold the pending lock yet — claim it so the guard covers them too.
          try {
               await prisma.transaction.update({ where: { id: keep.tx.id }, data: { pendingKey: clientSub.id, subscriptionId: plan.id } });
          } catch (error) {
               if (!isUniqueViolation(error)) throw error;
          }
          return {
               invoiceNumber: keep.tx.invoiceNumber, paymentLinkUrl: keep.invoice?.paymentLinkUrl,
               amount: keep.tx.amount, resumedFrom: keep.tx.createdAt, closedPrevious,
          };
     }

     // 3. Reserve the client's single pending slot BEFORE talking to IremboPay. The unique
     //    `pendingKey` makes a concurrent second request fail here instead of creating a 2nd invoice.
     let reservation;
     try {
          reservation = await prisma.transaction.create({
               data: {
                    amount: rwfAmount, quantity: 1, price: rwfAmount,
                    status: "pending", payNumber: client.phone, transactionMethod: "IremboPay",
                    provider: "IREMBO_PAY", transactionStatus: "PENDING",
                    pendingKey: clientSub.id,
                    subscription: { connect: { id: plan.id } },
                    clientSubscription: { connect: { id: clientSub.id } },
               },
          });
     } catch (error) {
          if (isUniqueViolation(error)) return { busy: "A payment is already in progress for your account. Please wait a few seconds and try again — you will not be charged twice." };
          throw error;
     }

     // 4. Create the invoice on IremboPay.
     let invoiceRes;
     try {
          invoiceRes = await iPay.invoice.createInvoice({
               transactionId: `WC-${client.id}-${reservation.id}`,
               paymentAccountIdentifier: IPAY_PAYMENT_ACCOUNT_IDENTIFIER,
               paymentItems: [{ code: plan.iremboProductCode, quantity: 1, unitAmount: rwfAmount }],
               description: `${plan.name} subscription`,
               expiryAt: invoiceExpiryFrom(reservation.createdAt).toISOString(),
               language: "EN",
               customer: { email: user.email, name: client.name, phoneNumber: client.phone },
          });
     } catch (error) {
          unstable_rethrow(error);
          console.log("IremboPay createInvoice error:", error);
          await failReservation(reservation.id);
          return { error: "Failed to create invoice" };
     }

     if (!invoiceRes?.success || !invoiceRes.data) {
          console.log("IremboPay createInvoice rejected:", invoiceRes?.message, invoiceRes?.errors);
          await failReservation(reservation.id);
          return { error: invoiceRes?.message || "Failed to create invoice" };
     }
     const { invoiceNumber, paymentLinkUrl } = invoiceRes.data;

     await prisma.transaction.update({ where: { id: reservation.id }, data: { invoiceNumber, updatedAt: new Date() } });

     RevalidatePages.clientSubscription();
     return { invoiceNumber, paymentLinkUrl, amount: rwfAmount, closedPrevious };
}

// Client-facing status check: always re-verifies with IremboPay directly (never trusts the
// widget's in-browser callback), reconciles our DB if a webhook hasn't landed yet, and cancels
// the transaction if it has gone stale unpaid. Only the owning client (or an admin) may check it.
export async function checkInvoiceStatus(invoiceNumber: string): Promise<{ paymentStatus: string; cancelled: boolean } | null> {
     const authUser = await getAuthContext();
     if (!authUser) return null;
     const tx = await prisma.transaction.findUnique({
          where: { invoiceNumber },
          select: { id: true, invoiceNumber: true, createdAt: true, transactionStatus: true, clientSubscription: { select: { clientId: true } } },
     });
     if (!tx) return null;
     if (!authUser.admin && authUser.client?.id !== tx.clientSubscription.clientId) return null;

     const r = await syncIremboTransaction(tx);
     if (!r.invoice) return r.state === "CANCELLED" ? { paymentStatus: "NEW", cancelled: true } : null;
     return { paymentStatus: r.invoice.paymentStatus, cancelled: r.state === "CANCELLED" || tx.transactionStatus === "CANCELLED" };
}
