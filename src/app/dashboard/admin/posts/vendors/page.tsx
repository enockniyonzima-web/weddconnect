
import { AdminContactTypeContainer } from "@/components/containers/admin/AdminContactTypesContainer";
import { HeroSection } from "./sections";
import {  VendorsContainer } from "./VendorsContainers";

export default function VendorsPage() {
         
     return (
          <>
               <HeroSection />
               <VendorsContainer />
               <AdminContactTypeContainer />
               
          </>
     )
}