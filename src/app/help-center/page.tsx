import HelpTopic from "@/components/cards/HelpTopic";
import ClientPage from "@/components/layout/ClientPage";


export default function HelpCenterPage() {
     const helpTopics = [
          {
            title: "Getting Started with WeddConnect",
            content:
              "WeddConnect is your one-stop platform for finding the perfect wedding vendors in Rwanda. Create an account, explore different categories, and connect with service providers that match your wedding vision. Our intuitive search filters help you narrow down options based on location, style, and budget.",
          },
          {
            title: "How to Search for Vendors",
            content:
              "Use our powerful search functionality to find wedding vendors. You can filter results by category (photographers, venues, florists, etc.), location, price range, and availability. Each vendor profile includes details, pricing, reviews, and contact information to help you make an informed decision.",
          },
          {
            title: "Contacting Vendors",
            content:
              "Once you've found a vendor you like, you can reach out directly through their profile page. Click the 'Contact' button to send a message or request a quote. Some vendors also provide direct phone numbers or WhatsApp contacts for faster communication.",
          },
          {
            title: "How to Book a Vendor",
            content:
              "Booking a vendor on WeddConnect is simple. After finalizing your selection, discuss availability and pricing directly with the vendor. Payments and contracts are handled between you and the vendor to ensure a smooth experience.",
          },
          {
            title: "Managing Your Bookings",
            content:
              "Keep track of your selected vendors and ongoing discussions in your WeddConnect account dashboard. You can view messages, confirm bookings, and manage changes all in one place to stay organized during your wedding planning journey.",
          },
          {
            title: "Leaving Reviews and Ratings",
            content:
              "Help future couples by leaving a review after your wedding. Share your experience with vendors by providing ratings and detailed feedback. Honest reviews help maintain quality and assist other users in making the right choices.",
          },
          {
            title: "Account Settings and Profile Management",
            content:
              "Customize your WeddConnect profile by updating your personal details, preferences, and notifications. You can also change your password, email address, or delete your account if necessary.",
          },
          {
            title: "Vendor Registration and Listing",
            content:
              "If you are a wedding vendor, you can join WeddConnect by creating a business profile. Add details about your services, upload portfolio images, and provide pricing information to attract couples planning their weddings.",
          },
          {
            title: "Payment and Pricing Information",
            content:
              "WeddConnect does not handle payments directly. Each vendor sets their own pricing and payment terms. Make sure to discuss payment schedules, deposits, and refund policies with the vendor before finalizing a booking.",
          },
          {
            title: "Customer Support and Assistance",
            content:
              "If you need any help using WeddConnect, our support team is here to assist you. Visit our Help Center to find answers to common questions, or contact us directly through email or live chat for personalized assistance.",
          },
        ];
        

  return (
     <ClientPage>
          <div className="w-full  py-8 px-4 lg:px-[10%]">
          <h1 className="text-3xl font-bold mb-6">Help Center</h1>
          {helpTopics.map((topic, index) => (
               <HelpTopic key={index} title={topic.title} content={topic.content} />
          ))}
     </div>
     </ClientPage>
  );
};
