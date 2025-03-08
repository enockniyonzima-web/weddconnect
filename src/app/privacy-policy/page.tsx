import ClientPage from "@/components/layout/ClientPage";
import { ListSection, TextSection } from "@/components/sections/PrivacyPolicyPageSections";

const PrivacySections = [
     {title: "Information Collection and Use",pos: 1,intro: "We collect various types of information to provide and improve our service to you",paragraphs: ["Personal identification information (Name, email address, phone number)","Usage Data (Browser type, access time, pages visited)", "Device information (IP address, browser type, operating system)", "Location data (City an country)", "Vendor preference and saved items."], type: "list"},
     {title: "How We Use Your Data", pos: 2, intro: "Your information helps us to:", paragraphs:["Personalize your wedding planning experience", "Improve our services and features", "Communicate with you about updates and offers", "Process your transactions and bookings", "Maintain and improve platform security"]},
     {title: "Data Protection",pos: 3,intro: "We implement robust security measures to protect your personal information:",paragraphs: ["Encryption of sensitive data","Regular security assessments", "Secure data storage practices", "Limited access to personal information", "Regular staff training on data protection."], type: "list"},
     {title: "Your Rights",pos: 4, intro: "You have the right to:",paragraphs: ["Access your personal data","Request data correction or deletion", "Withdraw consent for data processing", "Export your data", "Object to data processing"], type: 'list'},
]

export default function PrivacyPolicyPage () {
     return (
          <ClientPage>
               <div className="w-full flex flex-col gap-[30px] items-center justify-start px-[2%] md:px-[5%] lg:px-[10%] my-[20px] p-[20px] shadow-sm rounded-[10px]">
                    <h1 className="text-center w-full text-black text-[1.6rem] font-extrabold">Privacy Policy</h1>
                    {
                         PrivacySections.map((section, index) => section.type === "text" ? 
                         <TextSection key={`${section.title}-section-${index}`} content={section} />: 
                         section.type == "list" ? <ListSection key={`${section.title}-section-${index}`}  content={section} /> : null)
                    }
               </div>
          </ClientPage>
     )
}