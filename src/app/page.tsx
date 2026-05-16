import ClientPage from "@/components/layout/ClientPage";
import { HeroSection, HowItWorksSection, OurProfessionalSection, ReasonsToJoinSection, SocialPlatformsSection, TrendingSection } from "@/components/sections/HomeSections";

export default  function Home() {
  return (
    <ClientPage>
      <HeroSection />
      <TrendingSection />
      {/* <HotCategoriesSection /> */}
      <SocialPlatformsSection />
      <OurProfessionalSection />
      <ReasonsToJoinSection />
      <HowItWorksSection />
    </ClientPage>
  );
}
