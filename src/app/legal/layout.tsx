import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
     return (
          <div className="min-h-screen bg-black text-white">
               {/* Header */}
               <header className="sticky top-0 z-50 border-b border-gray-900 bg-black/95 backdrop-blur-sm">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                         <Link href="/">
                              <Image
                                   src="/logo/white-logo.png"
                                   alt="WeddConnect"
                                   width={130}
                                   height={40}
                                   className="h-8 w-auto object-contain"
                              />
                         </Link>
                         <Link
                              href="/"
                              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors group"
                         >
                              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                              Back to home
                         </Link>
                    </div>
               </header>

               {/* Page content */}
               <main>{children}</main>

               {/* Footer */}
               <footer className="border-t border-gray-900 mt-20">
                    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                         <div className="flex flex-col items-center md:items-start gap-2">
                              <Image
                                   src="/logo/white-logo.png"
                                   alt="WeddConnect"
                                   width={110}
                                   height={34}
                                   className="h-7 w-auto object-contain opacity-60"
                              />
                              <p className="text-xs text-gray-600">Connecting couples with perfect wedding vendors in Rwanda.</p>
                         </div>
                         <div className="flex flex-col items-center md:items-end gap-1 text-xs text-gray-600">
                              <span>info@weddconnect.com</span>
                              <span>+250 790 860 446</span>
                              <div className="flex items-center gap-3 mt-2">
                                   <Link href="/legal/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
                                   <span>·</span>
                                   <Link href="/legal/terms" className="hover:text-gray-400 transition-colors">Terms & Conditions</Link>
                              </div>
                         </div>
                    </div>
               </footer>
          </div>
     );
}
