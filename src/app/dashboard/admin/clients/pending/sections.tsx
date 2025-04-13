

export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-[10px]">
               <h1 className="text-[1.6rem] text-black font-bold w-full text-start leading-3">Pending Clients</h1>
               <div className="w-full flex items-end justify-between">
                    <p className="text-[0.9rem] text-gray-600">These clients are waiting for verification:</p>
               </div>
          </div>
     )
}