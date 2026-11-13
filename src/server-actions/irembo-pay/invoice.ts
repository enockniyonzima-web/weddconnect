"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { iPay, IPAY_PAYMENT_ACCOUNT_IDENTIFIER } from "@/config/iremboConfig";
import { getSessionUser } from "@/server-actions/user.actions";
import { createClientRecord, updateClientPhone } from "@/lib/server/accounts";
import { reconcileInvoicePayment } from "@/lib/server/payments";
import { getAuthContext } from "@/lib/auth-guard";
import { USD_TO_RWF_RATE } from "@/common/CommonTypes";
import { RevalidatePages } from "@/services/Server";

export async function createSubscriptionInvoice(subscriptionId: number, phone?: string): Promise<{ error?: string; invoiceNumber?: string; paymentLinkUrl?: string }> {
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
     const transactionId = `WC-${client.id}-${Date.now()}`;

     let invoiceRes;
     try {
          invoiceRes = await iPay.invoice.createInvoice({
               transactionId,
               paymentAccountIdentifier: IPAY_PAYMENT_ACCOUNT_IDENTIFIER,
               paymentItems: [{ code: plan.iremboProductCode, quantity: 1, unitAmount: rwfAmount }],
               description: `${plan.name} subscription`,
               expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
               language: "EN",
               customer: { email: user.email, name: client.name, phoneNumber: client.phone },
          });
     } catch (error) {
          unstable_rethrow(error);
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

// Client-facing status check: always re-verifies with IremboPay directly (never trusts the
// widget's in-browser callback), and reconciles our DB if a webhook hasn't landed yet.
// Only the client who owns the invoice (or an admin) may check it.
export async function checkInvoiceStatus(invoiceNumber: string) {
     const authUser = await getAuthContext();
     if (!authUser) return null;
     const tx = await prisma.transaction.findUnique({
          where: { invoiceNumber },
          select: { clientSubscription: { select: { clientId: true } } },
     });
     if (!tx) return null;
     if (!authUser.admin && authUser.client?.id !== tx.clientSubscription.clientId) return null;

     const res = await iPay.invoice.getInvoice(invoiceNumber);
     const invoice = res?.data;
     if (!invoice) return null;

     if (invoice.paymentStatus === "PAID" || invoice.paymentStatus === "PARTIALLY_PAID") {
          await reconcileInvoicePayment(invoiceNumber, invoice.paymentStatus, invoice.paymentMethod);
     }
     return invoice;
}
