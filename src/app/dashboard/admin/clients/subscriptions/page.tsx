import SubscriptionFormWrapper from "./forms/SubscriptionFormWrapper";
import { ClientPageHeroSection } from "../sections";
import SubscriptionsContainer from "./SubscriptionsContainer";

export default async function SubscriptionsPage({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}) {
     const search = await searchParams;
     
     return (
          <>
               <ClientPageHeroSection 
                    title="Manage Subscriptions"
                    description="Create and manage client subscription plans"
               />
               <SubscriptionsContainer search={search} />
               <SubscriptionFormWrapper search={search} />
          </>
     );
}