
import PendingClientsContainer from "./PendingClientsContainer"
import { HeroSection } from "./sections"


export default async function AdminClientsPage ({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}) {
     const search = await searchParams
     return (
          <>
               <HeroSection />
               <PendingClientsContainer search={search} />
          </>
     )
}