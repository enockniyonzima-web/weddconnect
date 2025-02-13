import ClientPage from "@/components/layout/ClientPage";

export default function NotFoundPage () 
{
     return (
          <ClientPage>
               <div className="w-full py-[100px] flex flex-col items-center gap-[10px] ">
                    <h3 className="text-[1.4rem] font-bold text-gray-800 ">Not found</h3>
                    <p className="text-[0.8rem] text-gray-600 text-center">Looks like this page does not exist.</p>
               </div>     
          </ClientPage>
     )
}