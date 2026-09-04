"use server";

import prisma from "@/lib/prisma";
import { iPay, IPAY_PAYMENT_ACCOUNT_IDENTIFIER } from "@/config/iremboConfig";
import { getSessionUser } from "@/server-actions/user.actions";
import { createClient } from "@/server-actions/client.actions";
import { USD_TO_RWF_RATE } from "@/common/CommonTypes";
import { RevalidatePages } from "@/services/Server";
import { getDaysCount } from "@/util/DateFunctions";
import { TDurationUnit } from "@/types/common";
import { ETransactionStatus } from "@prisma/client";

export async function createSubscriptionInvoice(subscriptionId: number, phone?: string): Promise<{ error?: string; invoiceNumber?: string; paymentLinkUrl?: string }> {
     const { user } = await getSessionUser();
     if (!user) return { error: "Not authenticated" };

     const plan = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
     if (!plan || !plan.isActive) return { error: "Subscription plan not found" };
     if (!plan.iremboProductCode) return { error: "This plan is not yet configured for payment" };

     const client = user.client ?? (phone ? await createClient({ name: user.email, phone, user: { connect: { id: user.id } } }) : null);
     if (!client) return { error: "A phone number is required to subscribe" };

     const rwfAmount = plan.currency === "RWF" ? plan.price : Math.round(plan.price * USD_TO_RWF_RATE);
     const transactionId = `WC-${client.id}-${Date.now()}`;

     let invoiceRes;
     try {
          invoiceRes = await iPay.invoice.createInvoice({
               transactionId,
               paymentAccountIdentifier: IPAY_PAYMENT_ACCOUNT_IDENTIFIER,
               paymentItems: [{ code: plan.iremboProductCode, quantity: 1, unitAmount: rwfAmount }],
               description: `${plan.name} subscription`,
               language: "EN",
               customer: { email: user.email, name: client.name, phoneNumber: client.phone },
          });
     } catch (error) {
          console.log("IremboPay createInvoice error:", error);
          return { error: "Failed to create invoice" };
     }

     if (!invoiceRes?.success || !invoiceRes.data) {
          console.log("IremboPay createInvoice rejected:", invoiceRes?.message, invoiceRes?.errors);
          return { error: invoiceRes?.message || "Failed to create invoice" };
     }
     const { invoiceNumber, paymentLinkUrl } = invoiceRes.data;

     const txData = {
          amount: rwfAmount, quantity: 1, price: rwfAmount, createdAt: new Date(), updatedAt: new Date(),
          status: "pending", payNumber: client.phone, transactionMethod: "IremboPay",
          provider: "IREMBO_PAY" as const, transactionStatus: "PENDING" as const, invoiceNumber,
     };

     const existingSub = await prisma.clientSubscription.findUnique({ where: { clientId: client.id } });
     if (existingSub) {
          await prisma.clientSubscription.update({ where: { id: existingSub.id }, data: { updatedAt: new Date(), transactions: { create: txData } } });
     } else {
          await prisma.clientSubscription.create({
               data: {
                    createdAt: new Date(), updatedAt: new Date(), expiryAt: null,
                    client: { connect: { id: client.id } },
                    subscription: { connect: { id: subscriptionId } },
                    transactions: { create: txData },
               },
          });
     }

     RevalidatePages.clientSubscription();
     return { invoiceNumber, paymentLinkUrl };
}

// Single source of truth for turning a confirmed IremboPay payment into an active subscription.
// Called from the webhook (authoritative) and from the client-side status poll (reconciliation
// fallback if a webhook is delayed or lost) — both re-verify against IremboPay, never the browser.
export async function reconcileInvoicePayment(invoiceNumber: string, paymentStatus: "PAID" | "PARTIALLY_PAID" | "FAILED", paymentMethod?: string) {
     const tx = await prisma.transaction.findUnique({
          where: { invoiceNumber },
          include: { clientSubscription: { include: { subscription: true } } },
     });
     if (!tx) return { error: "Transaction not found for invoice" };
     if (tx.transactionStatus === ETransactionStatus.PAID) return { ok: true }; // already processed

     await prisma.transaction.update({
          where: { id: tx.id },
          data: { transactionStatus: paymentStatus, status: paymentStatus.toLowerCase(), paymentMethod },
     });

     if (paymentStatus === "PAID") {
          const plan = tx.clientSubscription.subscription;
          const days = getDaysCount(plan.duration, plan.durationUnit as TDurationUnit);
          const currentExpiry = tx.clientSubscription.expiryAt;
          const base = currentExpiry && currentExpiry > new Date() ? currentExpiry : new Date();
          const expiryAt = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
          await prisma.clientSubscription.update({ where: { id: tx.clientSubscriptionId }, data: { expiryAt, updatedAt: new Date() } });
     }

     RevalidatePages.clientSubscription();
     RevalidatePages.transaction();
     return { ok: true };
}

// Client-facing status check: always re-verifies with IremboPay directly (never trusts the
// widget's in-browser callback), and reconciles our DB if a webhook hasn't landed yet.
export async function checkInvoiceStatus(invoiceNumber: string) {
     const res = await iPay.invoice.getInvoice(invoiceNumber);
     const invoice = res?.data;
     if (!invoice) return null;

     if (invoice.paymentStatus === "PAID" || invoice.paymentStatus === "PARTIALLY_PAID") {
          await reconcileInvoicePayment(invoiceNumber, invoice.paymentStatus, invoice.paymentMethod);
     }
     return invoice;
}
