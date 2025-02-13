import ClientPage from "@/components/layout/ClientPage";
import { HeroSection, HowItWorksSection, ProfessionalsSection } from "@/components/sections/HomeSections";

export default function Home() {
  return (
    <ClientPage>
      <HeroSection />
      <ProfessionalsSection />
      <HowItWorksSection />
    </ClientPage>
    
  );
}
