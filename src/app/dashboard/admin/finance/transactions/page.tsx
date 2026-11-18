import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/admin/insights/StatCard";
import TransactionsContainer from "./TransactionsContainer";

export default async function AdminFinanceTransactionsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     const search = await searchParams;

     return (
          <div className="w-full space-y-6 pb-10">
               <PageHeader
                    icon={<Receipt size={24} />}
                    title="Transactions"
                    description="Every payment made on the platform. Search for a client, pick dates, or filter by result. Tap any row to see full details."
               />
               <TransactionsContainer search={search} />
          </div>
     );
}
