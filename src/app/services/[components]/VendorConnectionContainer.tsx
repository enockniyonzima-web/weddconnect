import Image from "next/image";
import ProfessionalImage from "../../../../public/home/professional-image.jpg";

export default function VendorConnectionContainer() {
     return (
          <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[30px] py-[50px] px-[2.5%]" id="vendor-connection">
               <Image width={800} height={600} src={ProfessionalImage} alt="wedding consultant image" placeholder="blur" className="w-full aspect-[4/3] object-cover rounded-[20px]" />
               <div className="w-full flex flex-col items-start justify-start gap-[20px] py-[10px]">
                    <h2 className="text-white text-[2rem] font-bold ">Vendor connection</h2>
                    <p className="text-[1rem] font-medium text-gray-300">Bridging the Gap Between Couples and Trusted Wedding Professionals</p>
                    <div className="w-full flex flex-col items-start justify-start gap-[10px]">
                         <p className="text-[0.9rem] text-gray-400 ">Finding the right wedding vendors can be a time-consuming and frustrating task, especially when quality, trust, and reliability are at stake.</p>
                         <p className="text-[0.9rem] text-gray-400 ">WeddConnect solves this challenge by providing couples with access to a curated network of top-rated vendors — including venues, photographers, caterers, florists, stylists, decorators, and more. Our platform simplifies the search process by offering detailed vendor profiles, real reviews, transparent pricing, and instant communication channels to help you connect effortlessly.</p>
                    </div>
                    
                    <p className="text-[1rem] text-gray-300 italic">Don’t leave your big day to chance — use WeddConnect to connect with vendors you can trust, all in one convenient place.</p>
               </div>
               
          </section>
     )
}