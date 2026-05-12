import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, MapPin, Star } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
     return (
          <div className="min-h-screen bg-black flex">
               {/* Left Panel — Brand / Hero (hidden on mobile) */}
               <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-black" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.12),_transparent_60%)]" />

                    {/* Decorative rings */}
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-gray-900" />
                    <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-gray-900" />
                    <div className="absolute top-1/3 -right-24 w-64 h-64 rounded-full border border-blue-900/20" />

                    {/* Logo */}
                    <div className="relative z-10">
                         <Link href="/" className="inline-flex items-center gap-2 group">
                              <Image
                                   src="/logo/white-logo.png"
                                   alt="WeddConnect"
                                   width={160}
                                   height={48}
                                   className="h-10 w-auto object-contain"
                              />
                         </Link>
                    </div>

                    {/* Centre content */}
                    <div className="relative z-10 flex flex-col gap-8">
                         <div>
                              <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
                                   Where perfect weddings<br />
                                   <span className="text-blue-500">begin.</span>
                              </h2>
                              <p className="mt-4 text-gray-400 text-base leading-relaxed max-w-sm">
                                   Connect with Rwanda&apos;s finest wedding vendors, photographers, venues, planners and more. All in one place.
                              </p>
                         </div>

                         {/* Feature pills */}
                         <div className="flex flex-col gap-3">
                              {[
                                   { icon: MapPin, text: "Discover local wedding vendors across Rwanda" },
                                   { icon: Star, text: "Read verified reviews from real couples" },
                                   { icon: Heart, text: "Plan your dream wedding with ease" },
                              ].map(({ icon: Icon, text }) => (
                                   <div key={text} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0">
                                             <Icon className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="text-sm text-gray-400">{text}</span>
                                   </div>
                              ))}
                         </div>
                    </div>

                    {/* Bottom tagline */}
                    <div className="relative z-10">
                         <p className="text-xs text-gray-700">© {new Date().getFullYear()} WeddConnect. All rights reserved.</p>
                    </div>
               </div>

               {/* Right Panel — Auth Form */}
               <div className="w-full lg:w-1/2 flex flex-col min-h-screen">
                    {/* Top nav bar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-900 lg:border-transparent">
                         {/* Mobile logo */}
                         <Link href="/" className="lg:hidden">
                              <Image
                                   src="/logo/white-logo.png"
                                   alt="WeddConnect"
                                   width={120}
                                   height={36}
                                   className="h-8 w-auto object-contain"
                              />
                         </Link>
                         {/* Back to home */}
                         <Link
                              href="/"
                              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors ml-auto lg:ml-0 group"
                         >
                              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                              Back to home
                         </Link>
                    </div>

                    {/* Form content */}
                    <div className="flex-1 flex items-center justify-center px-6 py-10">
                         <div className="w-full max-w-md">
                              {children}
                         </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 text-center">
                         <p className="text-xs text-gray-700">
                              By continuing, you agree to our{" "}
                              <Link href="/terms" className="text-gray-600 hover:text-gray-400 transition-colors">Terms</Link>
                              {" & "}
                              <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-400 transition-colors">Privacy Policy</Link>
                         </p>
                    </div>
               </div>
          </div>
     );
}
