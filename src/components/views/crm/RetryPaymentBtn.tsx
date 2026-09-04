"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { checkInvoiceStatus } from "@/server-actions/irembo-pay/invoice";
import { loadIremboScript, payInvoice, pollInvoiceStatus } from "@/util/iremboWidget";
import { showMainNotification } from "@/util/NotificationFuncs";
import { ENotificationType } from "@/common/CommonTypes";

export const RetryPaymentBtn = ({ invoiceNumber }: { invoiceNumber: string }) => {
     const [status, setStatus] = useState<"idle" | "checking" | "confirming">("idle");

     const handleRetry = async () => {
          setStatus("checking");
          try {
               // Always re-verify with IremboPay first — never reopen the widget for an
               // invoice that's already paid (avoids a duplicate/double payment).
               const invoice = await checkInvoiceStatus(invoiceNumber);
               if (!invoice) {
                    showMainNotification("Could not find this invoice with IremboPay", ENotificationType.FAIL);
                    return;
               }
               if (invoice.paymentStatus === "PAID") {
                    showMainNotification("This payment is already confirmed", ENotificationType.PASS);
                    window.location.reload();
                    return;
               }

               await loadIremboScript();
               payInvoice(invoiceNumber, () => {
                    setStatus("confirming");
                    pollInvoiceStatus(
                         invoiceNumber,
                         () => { showMainNotification("Payment confirmed!", ENotificationType.PASS); window.location.reload(); },
                         () => { setStatus("idle"); showMainNotification("Payment not confirmed yet — try again in a moment", ENotificationType.WARNING); }
                    );
               });
          } catch {
               showMainNotification("Could not start payment. Try again later", ENotificationType.FAIL);
               setStatus("idle");
          }
     };

     return (
          <button
               type="button"
               onClick={handleRetry}
               disabled={status !== "idle"}
               className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
               {status !== "idle" ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
               {status === "checking" ? "Checking..." : status === "confirming" ? "Confirming..." : "Pay Now"}
          </button>
     );
};
