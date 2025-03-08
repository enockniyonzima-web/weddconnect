import FAQItem from "@/components/cards/FAQItem";
import ClientPage from "@/components/layout/ClientPage";

export default function FaqsPage (){
     const faqs = [
       {
         question: 'What services does WeddConnect offer?',
         answer:
           'WeddConnect connects couples with perfect wedding vendors in Rwanda, offering detailed profiles, photos, and the ability to customize searches based on style, budget, and requirements.',
       },
       {
         question: 'How can I contact potential vendors?',
         answer:
           'Our platform allows you to connect with the right vendors based on your preferences, enabling direct communication to discuss your wedding needs.',
       },
       {
         question: 'Is WeddConnect free to use for couples?',
         answer:
          'Yes, WeddConnect is free for couples to browse and connect with vendors. We aim to make your wedding planning experience seamless and enjoyable.',
       },
       {
         question: 'Can I find wedding venues through WeddConnect?',
         answer:
          'Absolutely! We showcase a variety of wedding venues in Rwanda, complete with detailed profiles and photos to help you make informed decisions.',
       },
       {
         question: 'How does WeddConnect ensure the quality of vendors?',
         answer:
          'We focus on connecting you with experienced and trusted vendors who align with your style and budget, ensuring a high-quality wedding experience.',
       },
     ];
   
     return (
          <ClientPage>
               <div className="w-full py-8 px-4 lg:px-[10%]">
                    <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
                         {faqs.map((faq, index) => (
                              <FAQItem key={index} question={faq.question} answer={faq.answer} />
                         ))}
               </div>
          </ClientPage>
     );
};