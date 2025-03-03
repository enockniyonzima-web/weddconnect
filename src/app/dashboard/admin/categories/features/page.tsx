import FeaturesContainer from "./FeaturesContainer";
import FeaturesFormsWrapper from "./forms/FeatureFormsWrapper";
import { HeroSection } from "./sections";

export default async function CategoryFeaturesPage ({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}) {
     const search  = await searchParams;
     return (
          <>
               <HeroSection />
               <FeaturesFormsWrapper search={search} />
               <FeaturesContainer search={search} />
          </>
     )
}