import ClientPage from "@/components/layout/ClientPage";
import { HeroSection, HowItWorksSection, OurProfessionalSection, ReasonsToJoinSection, TrendingSection } from "@/components/sections/HomeSections";

export default  function Home() {
  return (
    <ClientPage>
      <HeroSection />
      <TrendingSection />
      {/* <HotCategoriesSection /> */}
      <OurProfessionalSection />
      <ReasonsToJoinSection />
      <HowItWorksSection />
    </ClientPage>
    
  );
}
