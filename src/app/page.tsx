import ClientPage from "@/components/layout/ClientPage";
import { HeroSection, HotCategoriesSection, HowItWorksSection, ProfessionalsSection } from "@/components/sections/HomeSections";

export default  function Home() {
  return (
    <ClientPage>
      <HeroSection />
      <HotCategoriesSection />
      <ProfessionalsSection />
      <HowItWorksSection />
    </ClientPage>
    
  );
}
