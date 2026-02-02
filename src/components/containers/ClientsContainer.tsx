"use client";

import { TAdminClientSelect } from "@/app/dashboard/admin/clients/select-types";
import { ENotificationType } from "@/common/CommonTypes";
import { deleteClient } from "@/server-actions/client.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { useState } from "react";
import Image from "../ui/Image";

export const ClientsContainer = ({clients}:{clients: TAdminClientSelect[]}) => {
     if(clients.length === 0) return (
          <div className="w-full flex items-center gap-6">
               <p className="text-lg font-medium text-gray-600">No data found</p>
          </div>
     )
     const handleDeleteComplete = (id:number) => {console.log(id)}
     return (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-col-4 gap-4">
               {
                    clients.map(client => <ClientCard onDelete={handleDeleteComplete} client={client} key={client.id} />)
               }
          </div>
     )
}

// export const ClientCard = ({client, onDelete}:{client: TAdminClientSelect, onDelete: (id:number) => void}) => {
//      const [deleting,setDeleting] = useState<Set<number>>(new Set());
//           const deleteAction = async (id:number) =>{
//                const res = await deleteClient(id);
//                if(res) {
//                     showMainNotification("Deletion successful", ENotificationType.PASS);
//                }else {
//                     showMainNotification("Deletion failed", ENotificationType.FAIL);
//                }
//                setDeleting(prev => {
//                     const newSet = new Set(prev);
//                     newSet.delete(id);
//                     return newSet;
//                })
//           }
//      return (
//           <div></div>
//      )
// }

export const ClientCard = ({client, onDelete}:{client: TAdminClientSelect, onDelete: (id:number) => void}) => {
     const [deleting, setDeleting] = useState<Set<number>>(new Set());
     const [expanded, setExpanded] = useState(false);
     
     const deleteAction = async (id:number) => {
          const res = await deleteClient(id);
          if(res) {
               showMainNotification("Deletion successful", ENotificationType.PASS);
               onDelete(id);
          } else {
               showMainNotification("Deletion failed", ENotificationType.FAIL);
          }
          setDeleting(prev => {
               const newSet = new Set(prev);
               newSet.delete(id);
               return newSet;
          })
     }

     const handleDelete = () => {
          setDeleting(prev => new Set(prev).add(client.id));
          deleteAction(client.id);
     }

     const isDeleting = deleting.has(client.id);
     const hasSubscription = !!client.subscription;
     const hasPendingTransaction = client.subscription?.transactions && client.subscription.transactions.length > 0;
     const isExpired = client.subscription?.expiryAt ? new Date(client.subscription.expiryAt) < new Date() : false;

     return (
          <div className="w-full flex flex-col rounded-xl shadow-lg bg-white border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
               {/* Main Card Content */}
               <div className="w-full p-5">
                    <div className="flex items-start justify-between gap-4">
                         {/* Left Section - Avatar & Info */}
                         <div className="flex items-start gap-4 flex-1 min-w-0">
                              {/* Avatar */}
                              <div className="relative flex-shrink-0">
                                   {client.user.image ? (
                                        <Image 
                                             src={client.user.image} 
                                             alt={client.name}
                                             className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-sm object-cover"
                                        />
                                   ) : (
                                        <div className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-sm bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                             <span className="text-2xl font-semibold text-blue-700">
                                                  {client.name.charAt(0).toUpperCase()}
                                             </span>
                                        </div>
                                   )}
                                   {/* Subscription Status Badge */}
                                   {hasSubscription && (
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm ${
                                             isExpired ? 'bg-red-500' : 'bg-green-500'
                                        }`} title={isExpired ? 'Expired' : 'Active'} />
                                   )}
                              </div>

                              {/* Client Info */}
                              <div className="flex flex-col gap-2 flex-1 min-w-0">
                                   <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                             <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                  {client.name}
                                             </h3>
                                             {hasSubscription && (
                                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                                       isExpired 
                                                            ? 'bg-red-100 text-red-700' 
                                                            : 'bg-green-100 text-green-700'
                                                  }`}>
                                                       {client?.subscription?.subscription.name ?? "Not selected"}
                                                  </span>
                                             )}
                                        </div>
                                   </div>

                                   {/* Contact Info */}
                                   <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-gray-600">
                                             <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                             </svg>
                                             <span className="text-sm truncate">{client.user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                             <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                             </svg>
                                             <span className="text-sm">{client.phone}</span>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Right Section - Actions */}
                         <div className="flex flex-col gap-2 flex-shrink-0">
                              <button
                                   onClick={() => setExpanded(!expanded)}
                                   className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                   title="View Details"
                              >
                                   <svg 
                                        className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                   >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                   </svg>
                              </button>
                              <button
                                   onClick={handleDelete}
                                   disabled={isDeleting}
                                   className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                   title="Delete Client"
                              >
                                   {isDeleting ? (
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                   ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                   )}
                              </button>
                         </div>
                    </div>
               </div>

               {/* Expandable Details Section */}
               <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="border-t border-gray-100 bg-gray-50 p-5">
                         <div className="space-y-4">
                              {/* Client ID */}
                              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                   <span className="text-sm font-medium text-gray-500">Client ID</span>
                                   <span className="text-sm font-mono text-gray-900">#{client.id}</span>
                              </div>

                              {/* Subscription Details */}
                              {hasSubscription && client.subscription ? (
                                   <>
                                        <div>
                                             <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                  </svg>
                                                  Subscription Details
                                             </h4>
                                             <div className="space-y-2 pl-6">
                                                  <div className="flex items-center justify-between">
                                                       <span className="text-sm text-gray-600">Plan</span>
                                                       <span className="text-sm font-medium text-gray-900">{client.subscription?.subscription.name ?? "Not Subscription"}</span>
                                                  </div>
                                                  <div className="flex items-center justify-between">
                                                       <span className="text-sm text-gray-600">Expires</span>
                                                       <span className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                                                            {new Date(client.subscription?.expiryAt).toLocaleDateString()}
                                                       </span>
                                                  </div>
                                                  <div className="flex items-center justify-between">
                                                       <span className="text-sm text-gray-600">Last Updated</span>
                                                       <span className="text-sm text-gray-900">
                                                            {new Date(client.subscription.updatedAt).toLocaleDateString()}
                                                       </span>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Pending Transaction Alert */}
                                        {hasPendingTransaction && (
                                             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                  <div className="flex items-start gap-3">
                                                       <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                       </svg>
                                                       <div className="flex-1">
                                                            <h5 className="text-sm font-semibold text-amber-900 mb-2">Pending Transaction</h5>
                                                            {client.subscription.transactions.map(transaction => (
                                                                 <div key={transaction.id} className="space-y-1.5 text-sm">
                                                                      <div className="flex justify-between">
                                                                           <span className="text-amber-700">Amount:</span>
                                                                           <span className="font-medium text-amber-900">${transaction.amount}</span>
                                                                      </div>
                                                                      <div className="flex justify-between">
                                                                           <span className="text-amber-700">Method:</span>
                                                                           <span className="font-medium text-amber-900">{transaction.transactionMethod}</span>
                                                                      </div>
                                                                      <div className="flex justify-between">
                                                                           <span className="text-amber-700">Pay Number:</span>
                                                                           <span className="font-medium text-amber-900">{transaction.payNumber}</span>
                                                                      </div>
                                                                      <div className="flex justify-between">
                                                                           <span className="text-amber-700">Date:</span>
                                                                           <span className="font-medium text-amber-900">
                                                                                {new Date(transaction.createdAt).toLocaleDateString()}
                                                                           </span>
                                                                      </div>
                                                                      {transaction.proof && (
                                                                           <div className="mt-2 pt-2 border-t border-amber-200">
                                                                                <a 
                                                                                     href={transaction.proof} 
                                                                                     target="_blank" 
                                                                                     rel="noopener noreferrer"
                                                                                     className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                                                >
                                                                                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                     </svg>
                                                                                     View Proof
                                                                                </a>
                                                                           </div>
                                                                      )}
                                                                 </div>
                                                            ))}
                                                       </div>
                                                  </div>
                                             </div>
                                        )}
                                   </>
                              ) : (
                                   <div className="text-center py-4 text-gray-500">
                                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-sm">No active subscription</p>
                                   </div>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     )
}
