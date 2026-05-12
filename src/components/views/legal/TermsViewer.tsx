"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TermsAndConditions } from "@/lib/data/terms";
import { PrivacyPolicyData } from "@/lib/data/privacy-policy";

type Section = { pos: number; title: string; intro?: string; paragraphs: string[] };

const SectionList = ({ sections }: { sections: Section[] }) => (
     <div className="flex flex-col gap-6 pb-10">
          {sections.map((section) => (
               <div key={section.pos} className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-white">
                         {section.pos}. {section.title}
                    </h3>
                    {section.intro && (
                         <p className="text-xs text-gray-400 leading-relaxed">{section.intro}</p>
                    )}
                    <ul className="flex flex-col gap-1.5 mt-1">
                         {section.paragraphs.map((p, i) => (
                              <li key={i} className="flex gap-2 text-xs text-gray-500 leading-relaxed">
                                   <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                                   {p}
                              </li>
                         ))}
                    </ul>
               </div>
          ))}
     </div>
);

export const TermsViewer = ({ label = "Terms & Conditions" }: { label?: string }) => (
     <Sheet>
          <SheetTrigger asChild>
               <button className="text-blue-500 hover:text-blue-400 transition-colors text-sm underline-offset-2 hover:underline cursor-pointer">
                    {label}
               </button>
          </SheetTrigger>
          <SheetContent
               side="right"
               className="w-[95%] lg:w-[70%] max-w-none bg-gray-950 border-l border-gray-800 text-white overflow-y-auto"
          >
               <SheetHeader className="mb-6 border-b border-gray-800 pb-4">
                    <SheetTitle className="text-white text-lg font-bold">Terms &amp; Conditions</SheetTitle>
                    <p className="text-xs text-gray-500">Last updated: {TermsAndConditions.lastUpdated}</p>
               </SheetHeader>
               <SectionList sections={TermsAndConditions.sections} />
               <p className="text-xs text-gray-600 border-t border-gray-800 pt-4">
                    Questions? Contact us at{" "}
                    <a href={`mailto:${TermsAndConditions.contact.email}`} className="text-blue-500 hover:text-blue-400">
                         {TermsAndConditions.contact.email}
                    </a>
               </p>
          </SheetContent>
     </Sheet>
);

export const PrivacyViewer = ({ label = "Privacy Policy" }: { label?: string }) => (
     <Sheet>
          <SheetTrigger asChild>
               <button className="text-blue-500 hover:text-blue-400 transition-colors text-sm underline-offset-2 hover:underline cursor-pointer">
                    {label}
               </button>
          </SheetTrigger>
          <SheetContent
               side="right"
               className="w-[95%] lg:w-[70%] max-w-none bg-gray-950 border-l border-gray-800 text-white overflow-y-auto"
          >
               <SheetHeader className="mb-6 border-b border-gray-800 pb-4">
                    <SheetTitle className="text-white text-lg font-bold">Privacy Policy</SheetTitle>
                    <p className="text-xs text-gray-500">Last updated: {PrivacyPolicyData.lastUpdated}</p>
               </SheetHeader>
               <SectionList sections={PrivacyPolicyData.sections} />
               <p className="text-xs text-gray-600 border-t border-gray-800 pt-4">
                    Questions? Contact us at{" "}
                    <a href={`mailto:${PrivacyPolicyData.contact.email}`} className="text-blue-500 hover:text-blue-400">
                         {PrivacyPolicyData.contact.email}
                    </a>
               </p>
          </SheetContent>
     </Sheet>
);
