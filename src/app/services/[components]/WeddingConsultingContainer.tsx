import Image from "next/image";
import ConsultantImage from '../../../../public/services/wedding-consultant.jpg';

export default function WeddingConsultingContainer() {
     return (
          <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[30px] py-[40px] px-[2.5%]" id="wedding-consulting">
               <div className="w-full flex flex-col items-start justify-start gap-[20px] py-[10px]">
                    <h2 className="text-white text-[2rem] font-bold ">Wedding Consultation</h2>
                    <p className="text-[1rem] font-medium text-gray-300">Turning Your Vision Into a Seamless Reality</p>
                    <div className="w-full flex flex-col items-start justify-start gap-[10px]">
                         <p className="text-[0.9rem] text-gray-400 ">At WeddConnect, we understand that planning a wedding can be both exciting and overwhelming. Our Wedding Consulting service is designed to guide couples through every step of the planning process — from the initial brainstorming of ideas to the final “I do.” </p>
                         <p className="text-[0.9rem] text-gray-400 ">We offer personalized consultations tailored to the unique needs, preferences, and budget of each couple. Whether you&apos;re planning a grand celebration or an intimate gathering, our experienced consultants provide expert advice, timeline management, budgeting assistance, and vendor recommendations to bring your dream wedding to life.</p>
                    </div>
                    
                    <p className="text-[1rem] text-gray-300 italic">Let WeddConnect be your trusted partner in turning your love story into a beautifully orchestrated celebration — start planning with confidence today.</p>
               </div>
               <Image width={800} height={600} src={ConsultantImage} alt="wedding consultant image" placeholder="blur" className="w-full aspect-[4/3] object-cover rounded-[20px]" />
          </section>
     )
}