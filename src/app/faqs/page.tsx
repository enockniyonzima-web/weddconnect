import FAQItem from "@/components/cards/FAQItem";
import ClientPage from "@/components/layout/ClientPage";
import { HelpCircle } from "lucide-react";

const faqs = [
	{
		question: "What services does WeddConnect offer?",
		answer:
			"WeddConnect connects couples with perfect wedding vendors in Rwanda, offering detailed profiles, photos, and the ability to customize searches based on style, budget, and requirements.",
	},
	{
		question: "How can I contact potential vendors?",
		answer:
			"Our platform allows you to connect with the right vendors based on your preferences, enabling direct communication to discuss your wedding needs.",
	},
	{
		question: "Is WeddConnect free to use for couples?",
		answer:
			"Yes, WeddConnect is free for couples to browse and connect with vendors. We aim to make your wedding planning experience seamless and enjoyable.",
	},
	{
		question: "Can I find wedding venues through WeddConnect?",
		answer:
			"Absolutely! We showcase a variety of wedding venues in Rwanda, complete with detailed profiles and photos to help you make informed decisions.",
	},
	{
		question: "How does WeddConnect ensure the quality of vendors?",
		answer:
			"We focus on connecting you with experienced and trusted vendors who align with your style and budget, ensuring a high-quality wedding experience.",
	},
];

export default function FaqsPage() {
	return (
		<ClientPage>
			<div className="w-full min-h-screen bg-black">
				{/* Hero */}
				<div className="relative w-full bg-gray-950 border-b border-gray-800/60 py-20 px-[5%] overflow-hidden">
					<div className="absolute top-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
					<div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4">
						<div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
							<HelpCircle size={22} className="text-blue-400" />
						</div>
						<span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">
							FAQs
						</span>
						<h1 className="text-3xl md:text-4xl font-bold text-white">
							Frequently Asked Questions
						</h1>
						<p className="text-gray-400 text-sm max-w-md">
							Everything you need to know about WeddConnect. Can&apos;t find your
							answer? Reach us on WhatsApp.
						</p>
					</div>
				</div>

				{/* FAQ list */}
				<div className="max-w-3xl mx-auto w-full px-[5%] py-16 flex flex-col gap-3">
					{faqs.map((faq, index) => (
						<FAQItem key={index} question={faq.question} answer={faq.answer} />
					))}
				</div>
			</div>
		</ClientPage>
	);
}