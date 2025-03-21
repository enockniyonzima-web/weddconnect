import { IconType } from "react-icons";

export const ReasonToJoinCard = ({reason}:{reason: {name:string, icon:IconType, description:string}}) => {
     const Icon = reason.icon;
     return (
          <div className="w-full flex flex-col items-start justify-between gap-[20px] rounded-[20px] p-[20px] bg-gradient-to-br from-blue-950 via-black to-black shadow-sm shadow-blue-800">
               <div className="w-full flex flex-col items-start justify-start gap-[20px]">
                    <h3 className="text-[1.2rem] font-bold text-gray-200">{reason.name}</h3>
                    <p className="text-[1rem] text-gray-400">{reason.description}</p>
               </div>
               <div className="w-full flex items-center justify-end">
                    <i className="w-[80px] h-[80px] bg-gradient-to-br p-[10px] from-gray-900 to-blue-950 flex items-center justify-center rounded-full text-[40px] text-blue-600"><Icon /></i>
               </div>
          </div>
     )
}