import CategoriesContainer from "./CategoriesContainer";
import { HeroSection } from "./sections";

export default async function AdminCategoriesPage ({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}) {
     const search  = await searchParams;

     return (
          <>
               <HeroSection />
               <CategoriesContainer search={search} />
          </>
     )
}