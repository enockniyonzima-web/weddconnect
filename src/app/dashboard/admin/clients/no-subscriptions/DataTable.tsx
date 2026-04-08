"use client";

import React, { useState } from 'react'
import { TAdminClientSelect } from '../select-types';
import { getDate} from '@/util/DateFunctions';
import { formatPrice } from '@/util/stringFuncs';
import { deleteClient } from '@/server-actions/client.actions';
import { showMainNotification } from '@/util/NotificationFuncs';
import { ENotificationType } from '@/common/CommonTypes';
import Image from 'next/image';

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
                             <tr className="bg-gray-800 text-left text-gray-300">
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
                                  <tr key={`client-${c.id}`} className={`border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer ${active === c.id ? "border-[2px] border-blue-600 rounded-[10px]" :""}`} >
                                       <td className="p-3"><Image src={c.user.image} alt={c.name} width={40} height={40} className="w-[50px] aspect-square rounded-full object-cover " /></td>
                                       <td className="p-3 text-gray-300 text-sm text-nowrap">{c.name}</td>
                                       <td className="p-3 text-gray-300 text-sm text-nowrap">{c.user.email}</td>
                                       <td className="p-3 text-gray-300 text-sm text-nowrap">{c.phone}</td>
                                       <td className="p-3 text-gray-300 text-sm text-nowrap">{c.subscription?.subscription.name || "Not Subscription Selected"}</td>
                                       <td className="p-3 text-gray-300 flex flex-wrap gap-[5px] w-fit max-w-full">
                                            {
                                                 c.id === active ?
                                                 <>
                                                      <span className="text-[0.8rem] whitespace-nowrap text-gray-300 border border-gray-700 bg-gray-800 p-[5px] rounded-lg">Amount Paid: {c.subscription?.transactions[0]?.amount ? `Rwf ${formatPrice(c.subscription?.transactions[0]?.amount)}` : "Not defined"}</span>
                                                      <span className="text-[0.8rem] text-nowrap w-auto text-gray-300 border border-gray-700 bg-gray-800 p-[5px] rounded-lg">Account No: {c.subscription?.transactions[0]?.payNumber || "Not provided"}</span>
                                                      <span className="text-[0.8rem] text-nowrap w-auto text-gray-300 border border-gray-700 bg-gray-800 p-[5px] rounded-lg">Paid on: {c.subscription?.transactions[0]?.createdAt ? getDate(c.subscription?.transactions[0]?.createdAt) : "Not provided"}</span>
                                                      <span className="text-[0.8rem] text-nowrap w-auto text-gray-300 border border-gray-700 bg-gray-800 p-[5px] rounded-lg">Account Names: {c.subscription?.transactions[0]?.proof || "Not provide"}</span>
                                                      <span className="text-[0.8rem] text-nowrap w-auto text-gray-300 border border-gray-700 bg-gray-800 p-[5px] rounded-lg">Vendor used: {c.subscription?.transactions[0]?.transactionMethod || "Not Defined"}</span>
                                                 </>:
                                                 <span className="text-white bg-blue-600 hover:bg-blue-500 whitespace-nowrap p-2.5 rounded-lg transition-colors"  onClick={() => setActive(c.id)}>View Details</span>
                                            }
                                            
                                       </td>
                                       <td className="p-3">
                                            {
                                                 <button type="button" disabled={deleting.has(c.id)} onClick={() => deleteAction(c.id)} className="text-white bg-red-600 disabled:bg-gray-700 p-2.5 rounded-lg transition-colors">{deleting.has(c.id) ? "Deleting...":"Delete"}</button>
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