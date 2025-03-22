import { TPostFeature } from "@/common/Entities";
import { findIconByKey } from "../icons/icons-list";

export const PostFeatureCard = ({feature}: {feature:TPostFeature}) => {
     const Icon = findIconByKey(feature.categoryFeature.icon);
     return(
          <div title={feature.categoryFeature.name} className="w-auto cursor-pointer flex flex-col justify-start items-center gap-[3px] rounded-[2.5px] p-[2.5px] border border-gray-200 bg-white ">
               <p className='text-[0.65rem] text-black font-bold'>{feature.categoryFeature.name}</p>
               <div className="w-auto flex items-center gap-[2px] ">
                    {Icon && <i className="text-gray-400 text-[18px] md:text-[18px] p-[1px]"><Icon /></i>}
                    <span className="text-[0.85rem] lg:text-[0.7rem] text-black font-semibold whitespace-nowrap">: {feature.value}</span>
               </div>
          </div>
     )
}

export const LGPostFeatureCard = ({feature}: {feature:TPostFeature}) => {
     const Icon = findIconByKey(feature.categoryFeature.icon);
        return(
             <div className="w-full flex justify-start items-center gap-[3px] p-[5px] px-[10px] border-b border-gray-800 ">
                  <div className="w-auto flex items-center gap-[5px] ">
                       {Icon && <i className="text-gray-400 text-[26px] md:text-[22px] p-[2px]"><Icon /></i>}
                       <span className="text-[0.9rem] leading-3 lg:text-[0.8rem] text-gray-400 whitespace-nowrap">{feature.categoryFeature.name}: </span>
                  </div>
                  <span className="text-[0.9rem] lg:text-[0.85rem] text-gray-200 font-semibold whitespace-nowrap">{feature.value}</span>
             </div>
        )
   }