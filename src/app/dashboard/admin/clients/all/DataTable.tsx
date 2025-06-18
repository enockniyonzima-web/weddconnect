"use client";

import React, { useState } from 'react'
import { TAdminClientSelect } from '../select-types';
import Image from 'next/image';
import { getDate} from '@/util/DateFunctions';
import { formatPrice } from '@/util/stringFuncs';
import { deleteClient } from '@/server-actions/client.actions';
import { showMainNotification } from '@/util/NotificationFuncs';
import { ENotificationType } from '@/common/CommonTypes';

const DataTable = ({clients}: {clients: TAdminClientSelect[]}) => {
     const [active, setActive] = useState(0);
     const [deleting,setDeleting] = useState<Set<number>>(new Set());
     const deleteAction = async (id:number) =>{
          setDeleting(prev => new Set([...prev, id]));
          const res = await deleteClient(id);
          if(res) {
               showMainNotification("Deletion successful", ENotificationType.PASS);
          }else {
               showMainNotification("Deletion failed", ENotificationType.FAIL);
          }
          setDeleting(prev => {
               const newSet = new Set(prev);
               newSet.delete(id);
               return newSet;
          })
     }
  return (
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
                                                      <span className="text-[0.8rem] text-nowrap w-auto text-gray-800 border border-gray-400 bg-white p-[5px] rounded-[5px]">Vendor used: {c.subscription?.transactions[0]?.transactionMethod || "Not Defined"}</span>
                                                 </>:
                                                 <span className="text-white bg-blue-800 hover:bg-blue-600 whitespace-nowrap p-[10px] rounded-[10px]"  onClick={() => setActive(c.id)}>View Details</span>
                                            }
                                            
                                       </td>
                                       <td className="p-3">
                                            {
                                                 <button type="button" disabled={deleting.has(c.id)} onClick={() => deleteAction(c.id)} className="text-white bg-red-800 disabled:bg-gray-800 p-[10px] rounded-[10px]">{deleting.has(c.id) ? "Deleting...":"Delete"}</button>
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

export default DataTable