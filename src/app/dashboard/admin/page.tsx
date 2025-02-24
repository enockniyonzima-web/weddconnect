import { AdminStatistics, HeroSection, QuickOveriew } from "./sections";

export default async function AdminPage () {
     return (
          <div className="w-full flex flex-col items-center gap-[20px] justify-start bg-gray-50 p-[20px]">
               <HeroSection />
               <AdminStatistics />
               <QuickOveriew />
          </div>
     )
}