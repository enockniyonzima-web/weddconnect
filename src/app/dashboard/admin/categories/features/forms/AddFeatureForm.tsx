/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { ENotificationType } from "@/common/CommonTypes";
import { CheckInputGroup, SelectInputGroup, SubmitButton, TextInputGroup } from "@/components/forms/DataFormsInputs"
import { IconsList } from "@/components/icons/icons-list";
import { createCategoryFeature, updateCategoryFeature } from "@/server-actions/category-feature.actions";
import { createCategory } from "@/server-actions/category.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { DataInputs } from "@/util/util-classes";
import { CategoryFeature } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FeatureTypes:{label:string, value:string | number}[] = [
     {label: "Text", value: 'text'},
     {label: "Select", value:'select'},
     {label: 'Number', value: 'number'},
     {label: 'Checkbox', value: 'checkbox'},
     {label: 'Date', value: 'date'},
     {label: 'Large Text', value: 'textarea'}
]

function AddFeatureForm({updateFeature}: {updateFeature: CategoryFeature | null | undefined}) {
     const [loading, setLoading] = useState<boolean>(false);
     const dataInputs = new DataInputs();
     const router = useRouter()

     const saveCategoryFeature = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setLoading(true);
               showMainNotification("Saving new category feature...", ENotificationType.WARNING);
               const fieldsCheck = updateFeature ?  {status:true,message: ""}: dataInputs.checkFieldsIn(['name','type', 'values', 'rank', 'icon', ]);
               if(!fieldsCheck.status){
                    return showMainNotification(fieldsCheck.message, ENotificationType.WARNING);
               }

               const newFeature = updateFeature ? 
                    await updateCategoryFeature(updateFeature.id, {
                         name: dataInputs.get('name', updateFeature.name),
                         type: dataInputs.get('type',updateFeature.type),
                         required: dataInputs.get('required', updateFeature.required),
                         rank: dataInputs.get('rank', updateFeature.rank),
                         inFilter: dataInputs.get('inFilter', updateFeature.inFilter),
                         onCard: dataInputs.get('onCard', updateFeature.onCard),
                         icon: dataInputs.get('icon', updateFeature.icon),
                         values: dataInputs.get('values', updateFeature.values)
                    })
               : await createCategoryFeature({
                    name: dataInputs.get('name', ""),
                    type: dataInputs.get('type',""),
                    required: dataInputs.get('required', false),
                    rank: dataInputs.get('rank', 0),
                    inFilter: dataInputs.get('inFilter', false),
                    onCard: dataInputs.get('onCard', false),
                    icon: dataInputs.get('icon', ""),
                    values: dataInputs.get('values', '')
               });
               if(newFeature){
                    showMainNotification("Successfully save new Feature!!!", ENotificationType.PASS);
                    router.prefetch('/dashboard/admin/categories/features');
                    return router.push('/dashboard/admin/categories/features');
               }else {
                    showMainNotification("Error adding new feature. Contact Dushime for Support",ENotificationType.FAIL)
               }
               
          } catch (error) {
               showMainNotification("Error saving the category", ENotificationType.FAIL)
          }finally{
               setLoading(false);
          }
     }
     return (
          <form onSubmit={saveCategoryFeature} className="w-full flex items-center border rounded-[10px] p-[10px] flex-col gap-[10px]">
               <TextInputGroup type="text" label={`Feature Name: ${updateFeature ? updateFeature.name : ""}`} placeholder="Enter Category Name" name="name" required={updateFeature ? false : true} action={(res) => dataInputs.set('name', String(res), "string")} />
               <SelectInputGroup  label={`Feature Type: ${updateFeature ? updateFeature.type : ""} `} name="feature-type" required={updateFeature ? false : true} values={FeatureTypes}  action={(res) => dataInputs.set('type',String(res), "string")}   />
               <TextInputGroup type="text" label={`Feature Values: ${updateFeature ? updateFeature.values : "" }`} placeholder="placeholder, select values, separated by comma (,)" name="values" required={updateFeature ? false : true} action={(res) => dataInputs.set('values', String(res), "string")} />
               <div className="w-full grid grid-cols-3 ">
                    <CheckInputGroup label="On Card" placeholder="display on card" name="feature-on-card" required={false} action={(res) => dataInputs.set('onCard', res, "boolean")} />
                    <CheckInputGroup label="Feature Required" placeholder="feature required." name="feature-required" required={false} action={(res) => dataInputs.set('required', res, "boolean")} />
                    <CheckInputGroup label="In Filters" placeholder="feature-in-filters" name="feature-in-filters" required={false} action={(res) => dataInputs.set('inFilter', res, "boolean")}  />
               </div>
               <TextInputGroup type="number" label={`Rank: ${updateFeature ? updateFeature.rank : ""}`} placeholder="ex 0, 1 higher rank will be displayed first " name="feature-rank" required={updateFeature ? false : true} action={(res) => dataInputs.set('rank',Number(res), "number")}  />
               <SelectInputGroup label={`Feature Icon: ${updateFeature ? updateFeature.icon : ""} `} name="feature-icon" required={updateFeature ? false : true} values={IconsList.map(icon => ({label: icon.label, value: icon.key}))} action={(res) => dataInputs.set('icon',String(res), "string")}  />
               <SubmitButton loading={loading} loadText="Saving..." label="Save Feature" />
          </form>
     )
}

export default AddFeatureForm