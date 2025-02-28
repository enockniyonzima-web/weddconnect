import CategoriesContainer from "./CategoriesContainer";
import { CategoryFormWrapper } from "./forms/CategoryFormWrapper";
import { HeroSection } from "./sections";

export default async function AdminCategoriesPage ({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}) {
     const search  = await searchParams;

     return (
          <>
               <HeroSection />
               <CategoryFormWrapper search={search} />
               <CategoriesContainer search={search} />
          </>
     )
}