
import { HeroSection } from "./sections";
import { VendorContactTypesContainer, VendorsContainer } from "./VendorsContainers";

export default async function VendorsPage({searchParams}: {searchParams:Promise<Record<string, string | undefined>>}) {
     const search = await searchParams;
     const id = search.typeId;
         
     return (
          <>
               <HeroSection />
               <VendorsContainer search={search} />
               <VendorContactTypesContainer typeId={id} />
               
          </>
     )
}