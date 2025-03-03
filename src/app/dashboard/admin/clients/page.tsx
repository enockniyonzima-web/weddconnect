import ClientsContainer from "./ClientsContainer";
import { HeroSection } from "./sections";

export default async function AdminClientsPage ({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}) {
     const search = await searchParams
     return (
          <>
               <HeroSection />
               <ClientsContainer search={search} />
          </>
     )
}