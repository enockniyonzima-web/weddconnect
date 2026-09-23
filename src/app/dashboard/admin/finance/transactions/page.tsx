import { FinancePageHeroSection } from "../sections";
import TransactionsContainer from "./TransactionsContainer";

export default async function AdminFinanceTransactionsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     const search = await searchParams;

     return (
          <div className="w-full space-y-6">
               <FinancePageHeroSection title="Transactions" description="Every payment on the platform — filter by status or provider, and drill into any transaction or client." />
               <TransactionsContainer search={search} />
          </div>
     );
}
