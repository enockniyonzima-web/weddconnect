/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ENotificationType } from "@/common/CommonTypes";
import { TCategory, TPost } from "@/common/Entities";
import { SubmitButton } from "@/components/forms/DataFormsInputs";
import { updatePost } from "@/server-actions/post.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { CategoryFeature } from "@prisma/client";
import { ChangeEvent, useState } from "react";

export const PostFeauresForm = ({addedPost, post, selectedCategory, categories}:{addedPost:number, post: TPost | null, selectedCategory: number, categories: TCategory[]}) => {
     const [postFeatures,setPostFeatures] = useState<Array<{categoryFeatureId:number, value: string, categoryFeature: CategoryFeature}>>([]);
     const [savingPostFeatures, setSavingPostFeatures] = useState(false);

     const category:TCategory | undefined  =  categories.find(c => c.id === (selectedCategory === 0 ? post?.categoryId : selectedCategory));

     const updatePostFeatures = (feature: {value:string, categoryFeature: CategoryFeature}) => {
          setPostFeatures(prevFeatures => {
               const updateFeatures = [...prevFeatures];
               const existingFeatureIndex = prevFeatures.findIndex(f => f.categoryFeature?.name === feature.categoryFeature?.name)
               if(existingFeatureIndex !== -1){
                    updateFeatures[existingFeatureIndex].value = feature.value;
               }else {
                    updateFeatures.push({...feature, categoryFeatureId: feature.categoryFeature.id});
               }
               return updateFeatures;
          })
     }

      const savePostFeatures = async (event: ChangeEvent<HTMLFormElement>) => {
               event.preventDefault();
               if(postFeatures.length === 0) return showMainNotification("Please fill in the post features", ENotificationType.WARNING);
               try {
                    setSavingPostFeatures(true)
                    if(addedPost === 0 && post=== null) return showMainNotification('Please add a new post or select a post to update', ENotificationType.WARNING)
                    const postUpdate = await updatePost(post !== null ? post.id : addedPost, {
                         features: {createMany: {data: postFeatures.map(f => ({categoryFeatureId: f.categoryFeatureId, value: f.value}))}}
                    });
                    if(postUpdate){
                         return showMainNotification("Success saving post features", ENotificationType.PASS);
                    }else {
                         return showMainNotification("Error saving post features", ENotificationType.FAIL);
                    }
               } catch (error) {
                    showMainNotification("Error saving the post features", ENotificationType.FAIL);
               }finally{
                    setSavingPostFeatures(false)
               }
          }
     if(category === undefined || category.features.length === 0) return null;
     return (
          <form onSubmit={savePostFeatures} className='w-full'>
                    {
                         selectedCategory && 
                         <div className="w-full p-[5px] flex flex-col items-start justify-start gap-[5px]">
                              <h3 className='text-[0.9rem] text-gray-700 font-bold'>Post Features:</h3>
                              <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-[5px]">
                                   {
                                        (categories.find(c => c.id === (selectedCategory === 0 ? post?.categoryId : selectedCategory)))?.features.map((feature, index) => 
                                             <div key={`${feature.name}-${index}`} className="w-full flex flex-col gap-[2px]" >
                                                  <label htmlFor={`${feature.name}-${index}`} className="text-gray-600 text-[0.8rem] ">{feature.name}</label>
                                                  {
                                                       feature.type === 'textarea' ?
                                                       <textarea className="w-full border-gray-200 text-[0.8rem] border-[1.3px] bg-gray-100 rounded-[5px] outline-none p-[5px]" onChange={(e) => updatePostFeatures({value: e.target.value, categoryFeature: feature})} cols={8} rows={5} name={`${feature.name}-${index}`} id={`${feature.name}-${index}`}></textarea>
                                                       :feature.type === 'select' ?
                                                       <select className="w-full border-gray-200 border-[1.3px] bg-gray-100 rounded-[5px] outline-none p-[5px] py-[7px] text-[0.8rem] cursor-pointer" onChange={(e) => updatePostFeatures({value: e.target.value, categoryFeature: feature})} name={`${feature.name}-${index}`} id={`${feature.name}-${index}`} >
                                                            <option value="">Select {feature.name}...</option>
                                                            {
                                                                 feature.values.split(",").map((value, index) => <option key={`${feature.name}-dropdown-${index}`} value={value} >{value}</option>)
                                                            }
                                                       </select>
                                                       :feature.type === 'htmlValue' ? null
                                                       :feature.type === "number" ?
                                                       <input className="w-full border-gray-200 border-[1.3px] text-[0.8rem] bg-gray-100 rounded-[5px] outline-none p-[5px]" onChange={(e) => updatePostFeatures({ value: e.target.value, categoryFeature: feature})} type="text" inputMode="numeric" name={`${feature.name}-${index}`} id={`${feature.name}-${index}`} />
                                                       :feature.type === 'file' ?
                                                       <input className="w-full border-gray-200 border-[1.3px] bg-gray-100 rounded-[5px] outline-none p-[5px] text-[0.8rem] " onChange={(e) => updatePostFeatures({ value: e.target.value, categoryFeature: feature})} type="file" name={`${feature.name}-${index}`} id={`${feature.name}-${index}`} accept={feature.values} />
                                                       : <input className="w-full text-[0.8rem] border-gray-200 border-[1.3px] bg-gray-100 rounded-[5px] outline-none p-[5px]" onChange={(e) => updatePostFeatures({value: e.target.value, categoryFeature: feature})} name={`${feature.name}-${index}`} id={`${feature.name}-${index}`} type={feature.type || 'text'} placeholder={feature.values} required={feature.required} />
                                                  }
                                             </div>
                                        )
                                   }
                              </div>
                              <SubmitButton label="Save Post Features" loadText="Updating features..." loading={savingPostFeatures} />
                         </div>
                    }
               </form>
     )
}