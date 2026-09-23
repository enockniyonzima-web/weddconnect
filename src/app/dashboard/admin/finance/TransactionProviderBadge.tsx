import { ETransactionProvider } from "@prisma/client";
import { CreditCard, Wallet } from "lucide-react";

export const TransactionProviderBadge = ({ provider }: { provider: ETransactionProvider }) => {
     const isIrembo = provider === "IREMBO_PAY";
     const Icon = isIrembo ? Wallet : CreditCard;
     return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isIrembo ? "bg-blue-500/10 text-blue-400" : "bg-gray-500/10 text-gray-400"}`}>
               <Icon size={12} /> {isIrembo ? "IremboPay" : "Manual"}
          </span>
     );
};
