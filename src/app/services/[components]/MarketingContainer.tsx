import Image from "next/image";
import MarketingImage from '../../../../public/services/marketing.jpg';

export default function MarketingContainer() {
     return (
          <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[30px] py-[50px] px-[2.5%]" id="marketing">
               <div className="w-full flex flex-col items-start justify-start gap-[20px] py-[10px]">
                    <h2 className="text-white text-[2rem] font-bold ">Marketing</h2>
                    <p className="text-[1rem] font-medium text-gray-300">Helping Wedding Vendors Shine and Grow Their Businesses</p>
                    <div className="w-full flex flex-col items-start justify-start gap-[10px]">
                         <p className="text-[0.9rem] text-gray-400 ">WeddConnect isn’t just for couples — we’re a powerful marketing platform for wedding vendors too. In a competitive and ever-evolving industry, it’s essential for vendors to stand out and reach the right clients.</p>
                         <p className="text-[0.9rem] text-gray-400 ">Our Wedding Marketing services help vendors increase their visibility, build their brand, and generate high-quality leads. From strategic placement on our platform to social media promotion and content creation, we offer tailored solutions that showcase what makes each vendor unique.</p>
                    </div>
                    
                    <p className="text-[1rem] text-gray-300 italic">Grow your wedding business with us — partner with WeddConnect and let your services be discovered by the people who need them most.</p>
               </div>
               <Image width={800} height={600} src={MarketingImage} alt="wedding consultant image" placeholder="blur" className="w-full aspect-[4/3] object-cover rounded-[20px]" />
          </section>
     )
}