

export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-[10px]">
               <h1 className="text-2xl text-white font-bold w-full text-start">Pending Clients</h1>
               <div className="w-full flex items-end justify-between">
                    <p className="text-sm text-gray-400">These clients are waiting for verification:</p>
               </div>
          </div>
     )
}