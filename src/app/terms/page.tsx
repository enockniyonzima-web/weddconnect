import ClientPage from "@/components/layout/ClientPage";
import { ListSection, TextSection } from "@/components/sections/TermsPageSections";

const TermsSections = [
     {title: "User Agreement",pos: 1,paragraphs: ["By accessing our wedding planning platform, you agree tbe bound by these terms and conditions. These terms apply to all visitors, users, and vendors who access or use our Service.",""], type: "text"},
     {title: "Account Registration",pos: 2,paragraphs: ["Users must provide accurate and complete information when creating an acount.","Users are responsible for maintaining the security of their account credentials. ", "Users must notify us immediately of any unauthorized access", "We reserve the right to suspend or terminate accounts that violate our terms."], type: "list"},
     {title: "Vendor Services",pos: 3,paragraphs: ["Vendors must provide accurate service descriptions and pricing","All bookings and transactions must be processed through our platform", "Vendors are responsible for fulfilling their service commitments", "We act as a platform facilitator and are not responsible for vendor services"], type: 'list'},
     {title: "Intellictual Property",pos: 4,paragraphs: ["All content on this platform, including text, graphics, logos and  images, is protected by copyright and other intellectual property rights. Users may not reproduce or distribute this content without explicit permission.",""], type: "text"},
     {title: "Limitation Liability",pos: 5,paragraphs: ["We strive to provide accurate information but make no warranties about the completeness, reliability, or accuracy of this information. Any action you take based on the information on our platform is strictly at your own risk.",""], type: "text"},
]

export default function TermsPage () {
     return (
          <ClientPage>
               <div className="w-full flex flex-col gap-[30px] items-center justify-start mx-[2%] md:mx-[5%] lg:mx-[10%] my-[20px] p-[20px] shadow-sm rounded-[10px]">
                    <h1 className="text-center w-full text-black text-[1.6rem] font-extrabold">Terms and Conditions</h1>
                    {
                         TermsSections.map((section, index) => section.type === "text" ? 
                         <TextSection key={`${section.title}-section-${index}`} content={section} />: 
                         section.type == "list" ? <ListSection key={`${section.title}-section-${index}`}  content={section} /> : null)
                    }
               </div>
          </ClientPage>
     )
}