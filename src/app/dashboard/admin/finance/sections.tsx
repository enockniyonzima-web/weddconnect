import { Wallet } from "lucide-react";

export const FinancePageHeroSection = ({ title, description }: { title: string; description?: string }) => {
     return (
          <div className="w-full bg-gradient-to-r from-blue-950/50 to-indigo-950/50 rounded-xl border border-blue-800 p-6 md:p-8 shadow-sm">
               <div className="flex items-start gap-4">
                    <div className="bg-blue-900/50 p-3 rounded-xl shadow-sm flex-shrink-0">
                         <Wallet className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                         <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h1>
                         {description && <p className="text-gray-400 text-sm md:text-base leading-relaxed">{description}</p>}
                    </div>
               </div>
          </div>
     );
};
