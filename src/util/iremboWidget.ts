"use client";

import { checkInvoiceStatus } from "@/server-actions/irembo-pay/invoice";

declare global {
     interface Window {
          IremboPay?: {
               initiate: (opts: { publicKey: string; invoiceNumber: string; locale: string; callback: (err: unknown, resp: unknown) => void }) => void;
               locale: { EN: string; FR: string; RW: string };
               closeModal?: () => void;
          };
     }
}

const IPAY_WIDGET_SRC = process.env.NEXT_PUBLIC_IPAY_ENVIRONMENT === "production"
     ? "https://dashboard.irembopay.com/assets/payment/inline.js"
     : "https://dashboard.sandbox.irembopay.com/assets/payment/inline.js";

export function loadIremboScript(): Promise<void> {
     return new Promise((resolve, reject) => {
          if (window.IremboPay) return resolve();
          const existing = document.getElementById("irembopay-inline-script");
          if (existing) {
               existing.addEventListener("load", () => resolve());
               return;
          }
          const script = document.createElement("script");
          script.id = "irembopay-inline-script";
          script.src = IPAY_WIDGET_SRC;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load payment widget"));
          document.body.appendChild(script);
     });
}

// Opens the widget for an existing (already created, still unpaid) invoice.
export function payInvoice(invoiceNumber: string, onOutcome: () => void) {
     window.IremboPay?.initiate({
          publicKey: process.env.NEXT_PUBLIC_IPAY_PUBLIC_KEY || "",
          invoiceNumber,
          locale: window.IremboPay.locale.EN,
          callback: (err, resp) => {
               // Never trust this callback for activation — it only tells us the widget closed.
               if (err) console.error("IremboPay widget error:", err, resp);
               window.IremboPay?.closeModal?.();
               onOutcome();
          },
     });
}

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 20; // ~1 minute

// Re-verifies with IremboPay directly (never the browser) and reconciles our DB if paid.
// Returns a cleanup function to cancel the poll (e.g. on unmount).
export function pollInvoiceStatus(invoiceNumber: string, onPaid: () => void, onTimeout: () => void): () => void {
     let attempts = 0;
     const timer = setInterval(async () => {
          attempts += 1;
          const invoice = await checkInvoiceStatus(invoiceNumber);
          if (invoice?.paymentStatus === "PAID") {
               clearInterval(timer);
               onPaid();
          } else if (attempts >= POLL_MAX_ATTEMPTS) {
               clearInterval(timer);
               onTimeout();
          }
     }, POLL_INTERVAL_MS);
     return () => clearInterval(timer);
}
