import ClientPage from "@/components/layout/ClientPage";
import { HeroSection, HowItWorksSection, ProfessionalsSection, ReasonsToJoinSection, TrendingSection } from "@/components/sections/HomeSections";

export default  function Home() {
  return (
    <ClientPage>
      <HeroSection />
      <TrendingSection />
      {/* <HotCategoriesSection /> */}
      <ProfessionalsSection />
      <ReasonsToJoinSection />
      <HowItWorksSection />
    </ClientPage>
    
  );
}
