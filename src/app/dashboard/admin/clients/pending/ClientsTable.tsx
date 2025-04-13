/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { TAdminClientSelect } from "./PendingClientsContainer";
import { getDate, getFutureDate } from "@/util/DateFunctions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { ENotificationType } from "@/common/CommonTypes";
import { updateClientSubscription } from "@/server-actions/client-subscription.actions";
import { formatPrice } from "@/util/stringFuncs";
import { useState } from "react";

const ClientsTable = ({clients}:{clients:TAdminClientSelect[]}) => {
     const [active, setActive] = useState(0)
     const approvePayment = async (id:number, subscription:string) => {
          try {
               const res = await updateClientSubscription(id, {updatedAt: new Date(),expiryAt: subscription.toLowerCase() === "member" ? getFutureDate(1000): getFutureDate(90)});
               if(res) return showMainNotification("Successfully Approve client payment", ENotificationType.PASS);
               else return showMainNotification("Error updating client subscription", ENotificationType.FAIL);
          } catch (error) {
               return showMainNotification("Application Error", ENotificationType.FAIL);
          }
     }
     return(
          <div className="w-full overflow-x-auto">
               <table className="w-full border-collapse">
                    <thead>
                         <tr className="bg-gray-100 text-left text-gray-600">
                              <th className="p-3">Picture</th>
                              <th className="p-3">Name</th>
                              <th className="p-3">Email</th>
                              <th className="p-3">Phone</th>
                              <th className="p-3">Subscription</th>
                              <th className="p-3">Payment</th>
                              <th className="p-3">Actions</th>
                         </tr>
                    </thead>
                    <tbody>
                         {
                              clients.map(c => 
                              <tr key={`client-${c.id}`} className={`border-b hover:bg-gray-50 cursor-pointer ${active === c.id ? "border-[2px] border-blue-600 rounded-[10px]" :""}`} >
                                   <td className="p-3"><Image src={c.user.image} alt={c.name} width={40} height={40} className="w-[50px] aspect-square rounded-full object-cover " /></td>
                                   <td className="p-3 text-black text-[0.9rem] text-nowrap">{c.name}</td>
                                   <td className="p-3 text-black text-[0.9rem] text-nowrap">{c.user.email}</td>
                                   <td className="p-3 text-black text-[0.9rem] text-nowrap">{c.phone}</td>
                                   <td className="p-3 text-black text-[0.9rem] text-nowrap">{c.subscription?.subscription.name || "Not Subscription Selected"}</td>
                                   <td className="p-3 text-black flex flex-wrap gap-[5px] w-fit max-w-full">
                                        {
                                             c.id === active ?
                                             <>
                                                  <span className="text-[0.8rem] whitespace-nowrap text-gray-800 border border-gray-400 bg-white p-[5px] rounded-[5px]">Amount Paid: {c.subscription?.transactions[0]?.amount ? `Rwf ${formatPrice(c.subscription?.transactions[0]?.amount)}` : "Not defined"}</span>
                                                  <span className="text-[0.8rem] text-nowrap w-auto text-gray-800 border border-gray-400 bg-white p-[5px] rounded-[5px]">Account No: {c.subscription?.transactions[0]?.payNumber || "Not provided"}</span>
                                                  <span className="text-[0.8rem] text-nowrap w-auto text-gray-800 border border-gray-400 bg-white p-[5px] rounded-[5px]">Paid on: {c.subscription?.transactions[0]?.createdAt ? getDate(c.subscription?.transactions[0]?.createdAt) : "Not provided"}</span>
                                                  <span className="text-[0.8rem] text-nowrap w-auto text-gray-800 border border-gray-400 bg-white p-[5px] rounded-[5px]">Account Names: {c.subscription?.transactions[0]?.proof || "Not provide"}</span>
                                             </>:
                                             <span className="text-white bg-blue-800 hover:bg-blue-600 whitespace-nowrap p-[10px] rounded-[10px]"  onClick={() => setActive(c.id)}>View Details</span>
                                        }
                                        
                                   </td>
                                   <td className="p-3">
                                        {
                                             c.subscription && c.subscription.transactions.length > 0 ?
                                             <button type="button" onClick={async() => await approvePayment(c.subscription?.id || 0, c.subscription?.subscription.name || "")} className="text-white bg-green-800 hover:bg-green-600 p-[10px] rounded-[10px]">Approve</button>:
                                             <button type="button" disabled className="text-white bg-gray-800 p-[10px] rounded-[10px] disabled:cursor-not-allowed">Approve</button>
                                        }
                                   </td>
                              </tr> 
                              )
                         }
                    </tbody>
               </table>
          </div>
          
     )
}

export default ClientsTable;
