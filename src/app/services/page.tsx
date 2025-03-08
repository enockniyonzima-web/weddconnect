import ServiceCard from "@/components/cards/ServiceCard";
import ClientPage from "@/components/layout/ClientPage";
import { FaCameraRetro, FaCarSide, FaChurch, FaClipboardList, FaGifts, FaMusic, FaUtensils } from "react-icons/fa6";

export default function ServicesPage () {
     const services = [
       {
         icon: <FaChurch />,
         title: 'Venues',
         description:
           'Explore our curated selection of wedding venues, connecting couples with beautiful spaces to celebrate their special day.',
       },
       {
         icon: <FaClipboardList />,
         title: 'Wedding Planning',
         description:
           'Our expert wedding planners guide you through every step of your wedding journey, from initial concept to flawless execution.',
       },
       {
         icon: <FaCameraRetro />,
         title: 'Photography',
         description:
           'Discover our selection of talented photography companies who capture the magic of your wedding day in breathtaking detail.',
       },
       {
         icon: <FaUtensils />,
         title: 'Catering',
         description:
           'Connect with top catering services to provide exquisite culinary experiences that delight your guests.',
       },
       {
         icon: <FaMusic />,
         title: 'Entertainment',
         description:
           'Find the best entertainment options, including DJs and live bands, to keep your guests dancing all night.',
       },
       {
         icon: <FaCarSide />,
         title: 'Transportation',
         description:
           'Ensure a grand entrance and seamless travel with our premium transportation services, including luxury cars and limousines.',
       },
       {
         icon: <FaGifts />,
         title: 'Decor & Rentals',
         description:
           'Enhance your venue with stunning decor and essential rentals, creating the perfect ambiance for your celebration.',
       },
     ];
   
     return (
       <ClientPage>
          <div className="w-full px-[2%] mx-auto py-12">
               <h1 className="text-4xl font-bold text-center mb-12">Our Professional Services</h1>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                    <ServiceCard
                         key={index}
                         icon={service.icon}
                         title={service.title}
                         description={service.description}
                    />
                    ))}
               </div>
          </div>
       </ClientPage>

     );
   };