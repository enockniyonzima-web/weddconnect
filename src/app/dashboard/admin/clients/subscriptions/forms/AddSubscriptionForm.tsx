/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ENotificationType } from "@/common/CommonTypes";
import { SubmitButton, TextAreaInputGroup, TextInputGroup } from "@/components/forms/DataFormsInputs"
import { createSubscription } from "@/server-actions/subscription.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { DataInputs } from "@/util/util-classes";
import { useRouter } from "next/navigation";
import { useState } from "react";

function AddSubscriptionForm() {
     const [loading, setLoading] = useState<boolean>(false);
     const dataInputs = new DataInputs();
     const router = useRouter()

     const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setLoading(true);
               showMainNotification("Saving new subscription...", ENotificationType.WARNING);
               const checkInputs = dataInputs.checkFieldsIn(["name", "description", "price", ]);
               if(!checkInputs.status) return showMainNotification(checkInputs.message, ENotificationType.WARNING)
               const savedSubscription = await createSubscription({
                    name: dataInputs.get("name", ""),
                    description: dataInputs.get('description', ""),
                    price: dataInputs.get("price", 0)
               })
               if(savedSubscription) {
                    showMainNotification("Subscription Saved successfully", ENotificationType.PASS);
                    router.prefetch('/dashboard/admin/clients/subscriptions');
                    return router.push('/dashboard/admin/clients/subscriptions');
               }
          } catch (error) {
               showMainNotification("Error saving the subscription", ENotificationType.FAIL)
          }finally{
               setLoading(false);
          }
     }
     return (
          <form onSubmit={saveCategory} className="w-full flex items-center border rounded-[10px] p-[10px] flex-col gap-[10px]">
               <TextInputGroup type="text" label="Subscription Name: " placeholder="Enter Category Name" name="name" required action={(res) => dataInputs.set("name", res, "string")} />
               <TextInputGroup type="number" label="Subscription Price: " placeholder="Enter Category Name" name="name" required action={(res) => dataInputs.set("price", res, "number")} />
               <TextAreaInputGroup maxWords={500} label="Description (max words -- 500): " placeholder="Enter benefits separated by semi colon(;)" name="description" required action={(res) => dataInputs.set("description", res, "string")}  />
               <SubmitButton loading={loading} loadText="Saving..." label="Save Subscription" />
          </form>
     )
}

export default AddSubscriptionForm;