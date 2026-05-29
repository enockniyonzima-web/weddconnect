import { ClientPageHeroSection } from "../sections";
import SubscriptionsContainer from "./SubscriptionsContainer";

export default function SubscriptionsPage() {
     return (
          <>
               <ClientPageHeroSection 
                    title="Manage Subscriptions"
                    description="Create and manage client subscription plans"
               />
               <SubscriptionsContainer />
          </>
     );
}