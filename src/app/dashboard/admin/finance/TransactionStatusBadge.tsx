import { ETransactionStatus } from "@prisma/client";
import { AlertCircle, CheckCircle, Clock, MinusCircle, XCircle } from "lucide-react";

const STATUS_CONFIG: Record<ETransactionStatus, { label: string; className: string; icon: typeof CheckCircle }> = {
     PAID: { label: "Paid", className: "bg-green-950/50 text-green-400", icon: CheckCircle },
     PENDING: { label: "Pending", className: "bg-amber-950/50 text-amber-400", icon: Clock },
     PARTIALLY_PAID: { label: "Partially Paid", className: "bg-orange-950/50 text-orange-400", icon: AlertCircle },
     FAILED: { label: "Failed", className: "bg-red-950/50 text-red-400", icon: XCircle },
     EXPIRED: { label: "Expired", className: "bg-red-950/50 text-red-400", icon: XCircle },
     NONE: { label: "None", className: "bg-gray-800 text-gray-500", icon: MinusCircle },
};

export const TransactionStatusBadge = ({ status }: { status: ETransactionStatus }) => {
     const { label, className, icon: Icon } = STATUS_CONFIG[status];
     return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>
               <Icon size={12} /> {label}
          </span>
     );
};
