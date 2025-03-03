import SubscriptionFormWrapper from "./forms/SubscriptionFormWrapper";
import { HeroSection } from "./sections";
import SubscriptionsContainer from "./SubscriptionsContainer";

export default async function SubscriptionsPage ({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}){
     const search = await searchParams;
     
     return (
          <>
               <HeroSection />
               <SubscriptionsContainer search={search} />
               <SubscriptionFormWrapper search={search} />
          </>
     )
}