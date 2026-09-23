import { FinancePageHeroSection } from "./sections";
import FinanceStatsContainer from "./FinanceStatsContainer";

export default async function AdminFinancePage() {
     return (
          <div className="w-full space-y-6">
               <FinancePageHeroSection title="Finance Overview" description="Track revenue, pending payments, and how the platform is growing financially." />
               <FinanceStatsContainer />
          </div>
     );
}
