
import ClientPage from "@/components/layout/ClientPage"
import WeddingConsultingContainer from "./[components]/WeddingConsultingContainer";
import VendorConnectionContainer from "./[components]/VendorConnectionContainer";
import MarketingContainer from "./[components]/MarketingContainer";
import Image from "next/image";
import HeroImage from "../../../public/home/new-cp-image.webp";

export default function ServicesPage () {
     
   
     return (
       <ClientPage>
          <Image src={HeroImage} alt="wedding vendors" width={1200} height={800} className="w-full bg-black h-full top-0 fixed z-0 left-0" />
          <div className="w-full px-[2%] mx-auto py-12 bg-black/80 relative z-10">
               <h1 className="text-4xl font-bold text-center mb-12 py-[40px] text-white ">Our Professional Services</h1>
              <WeddingConsultingContainer />
              <VendorConnectionContainer />
              <MarketingContainer />
          </div>
       </ClientPage>

     );
   };

