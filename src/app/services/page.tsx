
import ClientPage from "@/components/layout/ClientPage"
import WeddingConsultingContainer from "./[components]/WeddingConsultingContainer";
import VendorConnectionContainer from "./[components]/VendorConnectionContainer";
import MarketingContainer from "./[components]/MarketingContainer";
import ServicesHero from "./[components]/ServicesHero";

export default function ServicesPage() {
  return (
    <ClientPage>
      <div className="w-full bg-black min-h-screen">
        {/* Hero */}
        <ServicesHero />

        {/* Service Sections */}
        <div className="w-full">
          <WeddingConsultingContainer />
          <VendorConnectionContainer />
          <MarketingContainer />
        </div>
      </div>
    </ClientPage>
  );
}

