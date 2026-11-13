"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { reconcilePendingTransactions } from "@/server-actions/irembo-pay/admin";

export const ReconcilePendingButton = () => {
     const router = useRouter();
     const [running, setRunning] = useState(false);

     const handleClick = async () => {
          if (!window.confirm("Check every pending IremboPay transaction with IremboPay?\n\nPaid ones will activate the client's subscription; unpaid ones older than 24 hours will be cancelled.")) return;
          setRunning(true);
          try {
               const res = await reconcilePendingTransactions();
               if (res.error || !res.summary) return toast.error(res.error || "Reconciliation failed");
               const { checked, paid, cancelled, stillPending, errors, remaining } = res.summary;
               if (checked === 0) return toast.success("No pending IremboPay transactions");
               const parts = [`${checked} checked`, `${paid} paid`, `${cancelled} cancelled`, `${stillPending} still pending`];
               if (errors) parts.push(`${errors} couldn't be reached`);
               toast[errors ? "warning" : "success"](`Reconciled: ${parts.join(", ")}`);
               if (remaining > 0) toast.info(`${remaining} more pending — run again to continue`);
               router.refresh();
          } finally {
               setRunning(false);
          }
     };

     return (
          <button
               type="button"
               onClick={handleClick}
               disabled={running}
               className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-600/15 text-amber-400 border border-amber-600/30 hover:bg-amber-600/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
               {running ? <Loader2 size={13} className="animate-spin" /> : <RefreshCcw size={13} />}
               {running ? "Reconciling..." : "Reconcile pending"}
          </button>
     );
};
