import { PrivacyPolicyData } from "@/lib/data/privacy-policy";
import { Shield, Database, Settings, Share2, Clock, User, Cookie, Edit, Mail, Lock } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
     database: <Database className="w-5 h-5" />,
     settings: <Settings className="w-5 h-5" />,
     share: <Share2 className="w-5 h-5" />,
     shield: <Shield className="w-5 h-5" />,
     clock: <Clock className="w-5 h-5" />,
     user: <User className="w-5 h-5" />,
     cookie: <Cookie className="w-5 h-5" />,
     edit: <Edit className="w-5 h-5" />,
     mail: <Mail className="w-5 h-5" />,
     lock: <Lock className="w-5 h-5" />,
};

export default function PrivacyPolicyPage() {
     const { sections, lastUpdated, contact } = PrivacyPolicyData;

     return (
          <div className="max-w-5xl mx-auto px-6 py-16">
               {/* Hero */}
               <div className="mb-14 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
                         <Shield className="w-3.5 h-3.5" />
                         Legal · Privacy Policy
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
                         Your Privacy, <span className="text-blue-500">Protected.</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-base leading-relaxed">
                         At WeddConnect, we are committed to protecting your personal information and being transparent about how we collect, use, and safeguard your data. This policy explains your rights and our responsibilities.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                         <span>Last updated: <span className="text-gray-400">{lastUpdated}</span></span>
                         <span>·</span>
                         <Link href="/legal/terms" className="text-blue-500 hover:text-blue-400 transition-colors">
                              View Terms &amp; Conditions →
                         </Link>
                    </div>
               </div>

               <div className="flex flex-col lg:flex-row gap-10">
                    {/* TOC sidebar */}
                    <aside className="lg:w-60 flex-shrink-0">
                         <div className="sticky top-24">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Contents</p>
                              <nav className="flex flex-col gap-1">
                                   {sections.map((s) => (
                                        <a
                                             key={s.pos}
                                             href={`#section-${s.pos}`}
                                             className="text-sm text-gray-500 hover:text-white transition-colors py-1 pl-3 border-l border-gray-800 hover:border-blue-600"
                                        >
                                             {s.pos}. {s.title}
                                        </a>
                                   ))}
                              </nav>
                         </div>
                    </aside>

                    {/* Sections */}
                    <div className="flex-1 flex flex-col gap-8">
                         {sections.map((section) => (
                              <section
                                   key={section.pos}
                                   id={`section-${section.pos}`}
                                   className="bg-gray-950 border border-gray-900 rounded-2xl p-7 flex flex-col gap-5 scroll-mt-28"
                              >
                                   <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                                             {iconMap[section.icon] ?? <Shield className="w-5 h-5" />}
                                        </div>
                                        <h2 className="text-lg font-bold text-white">
                                             <span className="text-blue-500 mr-1">{section.pos}.</span>
                                             {section.title}
                                        </h2>
                                   </div>

                                   {section.intro && (
                                        <p className="text-gray-400 text-sm leading-relaxed">{section.intro}</p>
                                   )}

                                   <ul className="flex flex-col gap-2.5">
                                        {section.paragraphs.map((item, i) => (
                                             <li key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                                  {item}
                                             </li>
                                        ))}
                                   </ul>
                              </section>
                         ))}

                         {/* Contact card */}
                         <div className="bg-blue-600/5 border border-blue-600/20 rounded-2xl p-7 flex flex-col gap-3">
                              <p className="text-sm font-semibold text-white">Questions about this policy?</p>
                              <p className="text-sm text-gray-400">Reach our Data Protection team directly:</p>
                              <div className="flex flex-col gap-1.5 text-sm">
                                   <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">{contact.email}</a>
                                   <a href={`tel:${contact.phone}`} className="text-blue-400 hover:text-blue-300 transition-colors">{contact.phone}</a>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}