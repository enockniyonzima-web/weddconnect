"use client";

import { TAdminClientSelect } from "@/app/dashboard/admin/clients/select-types";
import { ENotificationType } from "@/common/CommonTypes";
import { deleteClient } from "@/server-actions/client.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { useState } from "react";
import Image from "../ui/Image";
import { X, Eye, Trash2, CheckCircle, XCircle, Plus, Calendar } from "lucide-react";
import { createClientSubscription, updateClientSubscription } from "@/server-actions/client-subscription.actions";
import { getFutureDate } from "@/util/DateFunctions";
import { useSubscriptions } from "@/context/SubscriptionContext";
import { TSubscription } from "@/common/Entities";

export const ClientsContainer = ({clients}:{clients: TAdminClientSelect[]}) => {
     if(clients.length === 0) return (
          <div className="w-full flex items-center gap-6">
               <p className="text-lg font-medium text-gray-500">No data found</p>
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

const USDRate = 1450;

export const ClientCard = ({client, onDelete}:{client: TAdminClientSelect, onDelete: (id:number) => void}) => {
     const [deleting, setDeleting] = useState<Set<number>>(new Set());
     const [showDialog, setShowDialog] = useState(false);
     const [isProcessing, setIsProcessing] = useState(false);
     const {subscriptions} = useSubscriptions();
     const [selectedSub,setSelectedSub] = useState<TSubscription | null>(null);
     
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
          if (window.confirm('Are you sure you want to delete this client?')) {
               setDeleting(prev => new Set(prev).add(client.id));
               deleteAction(client.id);
          }
     }

     const handleCreateSubscription = async () => {
          if(!selectedSub) {
               showMainNotification("Please select a subscription plan", ENotificationType.FAIL);
               return;
          }
          
          if (!window.confirm(`Create ${selectedSub.name} subscription for ${client.name}? This will activate immediately.`)) return;
          
          setIsProcessing(true);
          const amount = selectedSub.price * USDRate;
          try {
               const expiryAt  = getFutureDate(selectedSub.name === "Member" ? 365 : 90);
               const res = await createClientSubscription({
                    client: {connect: {id: client.id}},
                    subscription: {connect: {id: selectedSub.id}},
                    expiryAt,
                    transactions: {
                         create: {
                              amount,
                              price: amount,
                              status: "Approved",
                              quantity: 1,
                              payNumber: client.phone,
                              transactionMethod: "Cash"
                         }
                    }
               });
               if(!res) return showMainNotification("Subscription creation failed", ENotificationType.FAIL);
               showMainNotification("Subscription created successfully", ENotificationType.PASS);
               setShowDialog(false);
               setSelectedSub(null);
               window.location.reload();
          } catch {
               showMainNotification("An error occurred", ENotificationType.FAIL);
          } finally {
               setIsProcessing(false);
          }
     }

     const handleRenewSubscription = async () => {
          if (!window.confirm(`Are you sure you want to renew ${client.name}'s subscription?`)) return;
          
          setIsProcessing(true);
          const sub = client.subscription?.subscription.name;
          const expiryAt  = getFutureDate(sub && sub === "Member" ? 365 : 90);
          const amount = client.subscription?.transactions[0]?.amount || 0;
          
          try {
               const res = await updateClientSubscription(client.subscription?.id ?? -1, {
                    expiryAt, 
                    transactions: {
                         create: {
                              amount,
                              price: amount,
                              status: "Approved",
                              quantity: 1,
                              payNumber: client.phone,
                              transactionMethod: "Cash"
                         }
                    }
               })
               if(!res) return showMainNotification("Subscription renewal failed", ENotificationType.FAIL);
               showMainNotification("Subscription renewed successfully", ENotificationType.PASS);
               window.location.reload();
          } finally {
               setIsProcessing(false);
          }
     }

     const handleApproveSubscription = async () => {
          if (!window.confirm(`Approve ${client.name}'s subscription request? This will activate their subscription immediately.`)) return;
          
          setIsProcessing(true);
          const sub = client.subscription?.subscription.name;
          const expiryAt  = getFutureDate(sub && sub === "Member" ? 365 : 90);
          try {
               const res = await updateClientSubscription(client.subscription?.id ?? -1, {
                    expiryAt, 
                    transactions: {
                         update: {where: {id: client.subscription?.transactions[0].id}, data: {status: "Approved"}}
                    }
               })
               if(!res) return showMainNotification("Subscription approval failed", ENotificationType.FAIL);
               showMainNotification("Subscription approved successfully", ENotificationType.PASS);
               window.location.reload();
          } finally {
               setIsProcessing(false);
          }
     }

     const handleRejectSubscription = async () => {
          if (!window.confirm(`Reject ${client.name}'s subscription request? This action cannot be undone.`)) return;
          
          setIsProcessing(true);
          try {
               const res = await updateClientSubscription(client.subscription?.id ?? -1, {
                    expiryAt: null,
                    transactions: {
                         update: {where: {id: client.subscription?.transactions[0].id}, data: {status: "Rejected"}}
                    }
               })
               if(!res) return showMainNotification("Subscription rejection failed", ENotificationType.FAIL);
               showMainNotification("Subscription request rejected", ENotificationType.PASS);
               window.location.reload();
          } finally {
               setIsProcessing(false);
          }
     }

     const handleCancelSubscription = async () => {
          if (!window.confirm(`Cancel ${client.name}'s subscription? They will lose access immediately.`)) return;
          
          setIsProcessing(true);
          try {
               const res = await updateClientSubscription(client.subscription?.id ?? -1, {
                    expiryAt: null,
                    transactions: {
                         update: {where: {id: client.subscription?.transactions[0].id}, data: {status: "Cancelled"}}
                    }
               })
               if(!res) return showMainNotification("Subscription cancellation failed", ENotificationType.FAIL);
               showMainNotification("Subscription cancelled successfully", ENotificationType.PASS);
               window.location.reload();
          } finally {
               setIsProcessing(false);
          }
     }

     const isDeleting = deleting.has(client.id);
     const hasSubscription = !!client.subscription;
     const hasPendingTransaction = client.subscription && client.subscription.transactions && client.subscription.transactions.length > 0 && ( client.subscription.expiryAt == null || client.subscription.transactions[0].createdAt > client.subscription.expiryAt) ;
     const isExpired = client.subscription?.expiryAt ? new Date(client.subscription.expiryAt) < new Date() : false;
     const isActive = hasSubscription && !isExpired && !hasPendingTransaction;

     return (
          <>
               <div className="w-full flex h-auto flex-col rounded-xl bg-gray-900 border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300">
                    {/* Main Card Content */}
                    <div className="w-full p-5">
                         <div className="flex items-start gap-4">
                              {/* Avatar */}
                              <div className="relative flex-shrink-0">
                                   {client.user.image ? (
                                        <Image 
                                             src={client.user.image} 
                                             alt={client.name}
                                             className="w-16 h-16 rounded-full border-2 border-gray-700 shadow-sm object-cover"
                                        />
                                   ) : (
                                        <div className="w-16 h-16 rounded-full border-2 border-gray-700 shadow-sm bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center">
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
                                   <div>
                                        <h3 className="text-lg font-semibold text-white truncate">
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

                                   {/* Contact Info */}
                                   <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-gray-400">
                                             <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                             </svg>
                                             <span className="text-sm truncate">{client.user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                             <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                             </svg>
                                             <span className="text-sm">{client.phone}</span>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Action Bar */}
                    <div className="w-full border-t border-gray-800 bg-gray-800/50 p-3 flex items-center justify-between gap-2">
                         <button
                              onClick={() => setShowDialog(true)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                         >
                              <Eye className="w-4 h-4" />
                              View
                         </button>

                         <div className="flex items-center gap-2">
                              {/* Active Subscription - Show Cancel Button */}
                              {isActive && (
                                   <button
                                        onClick={handleCancelSubscription}
                                        disabled={isProcessing}
                                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Cancel active subscription"
                                   >
                                        <XCircle className="w-4 h-4" />
                                        Cancel
                                   </button>
                              )}

                              {/* Pending Subscription - Show Approve/Reject Buttons */}
                              {hasPendingTransaction && (
                                   <>
                                        <button
                                             onClick={handleApproveSubscription}
                                             disabled={isProcessing}
                                             className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                             title="Approve subscription request"
                                        >
                                             <CheckCircle className="w-4 h-4" />
                                             Approve
                                        </button>
                                        <button
                                             onClick={handleRejectSubscription}
                                             disabled={isProcessing}
                                             className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                             title="Reject subscription request"
                                        >
                                             <XCircle className="w-4 h-4" />
                                             Reject
                                        </button>
                                   </>
                              )}

                              {/* Expired Subscription - Show Renew Button */}
                              {isExpired && !hasPendingTransaction && (
                                   <button
                                        onClick={handleRenewSubscription}
                                        disabled={isProcessing}
                                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Renew expired subscription"
                                   >
                                        <Calendar className="w-4 h-4" />
                                        Renew
                                   </button>
                              )}

                              {/* No Subscription - Show Create Button */}
                              {!hasSubscription && (
                                   <button
                                        onClick={() => setShowDialog(true)}
                                        disabled={isProcessing}
                                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Create new subscription"
                                   >
                                        <Plus className="w-4 h-4" />
                                        Create
                                   </button>
                              )}

                              <button
                                   onClick={handleDelete}
                                   disabled={isDeleting}
                                   className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                   title="Delete Client"
                              >
                                   {isDeleting ? (
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                   ) : (
                                        <Trash2 className="w-5 h-5" />
                                   )}
                              </button>
                         </div>
                    </div>
               </div>

               {/* Details Dialog */}
               {showDialog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                         <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                              {/* Dialog Header */}
                              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                                   <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                             {client.user.image ? (
                                                  <Image 
                                                       src={client.user.image} 
                                                       alt={client.name}
                                                       className="w-16 h-16 rounded-full border-2 border-white shadow-lg object-cover"
                                                  />
                                             ) : (
                                                  <div className="w-16 h-16 rounded-full border-2 border-white shadow-lg bg-white/20 flex items-center justify-center">
                                                       <span className="text-3xl font-bold">
                                                            {client.name.charAt(0).toUpperCase()}
                                                       </span>
                                                  </div>
                                             )}
                                             <div>
                                                  <h2 className="text-2xl font-bold">{client.name}</h2>
                                                  <p className="text-blue-100">Client ID: #{client.id}</p>
                              </div>
                         </div>
                         <button
                              onClick={() => setShowDialog(false)}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              aria-label="Close dialog"
                              title="Close"
                         >
                              <X className="w-6 h-6" />
                         </button>
                    </div>
               </div>                              {/* Dialog Content */}
                              <div className="flex-1 overflow-y-auto p-6">
                                   <div className="space-y-6">
                                        {/* Contact Information */}
                                        <div>
                                             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                                                  Contact Information
                                             </h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div className="bg-gray-800 p-4 rounded-lg">
                                                       <p className="text-sm text-gray-400 mb-1">Email</p>
                                                       <p className="font-medium text-white">{client.user.email}</p>
                                                  </div>
                                                  <div className="bg-gray-800 p-4 rounded-lg">
                                                       <p className="text-sm text-gray-400 mb-1">Phone</p>
                                                       <p className="font-medium text-white">{client.phone}</p>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Subscription Details */}
                                        <div>
                                             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                                                  Subscription Status
                                             </h3>
                                             {hasSubscription && client.subscription ? (
                                                  <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                                                       <div className="flex items-center justify-between">
                                                            <span className="text-gray-400">Plan</span>
                                                            <span className="font-semibold text-white">{client.subscription.subscription.name}</span>
                                                       </div>
                                                       <div className="flex items-center justify-between">
                                                            <span className="text-gray-400">Last Updated</span>
                                                            <span className="font-medium text-white">
                                                                 {new Date(client.subscription.updatedAt).toLocaleDateString()}
                                                            </span>
                                                       </div>
                                                       <div className="flex items-center justify-between">
                                                            <span className="text-gray-400">Expires</span>
                                                            <span className={`font-semibold ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                                                                 {client.subscription.expiryAt ? new Date(client.subscription.expiryAt).toLocaleDateString() : "N/A"}
                                                            </span>
                                                       </div>
                                                       <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                                                            <span className="text-gray-400">Status</span>
                                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                                                                 hasPendingTransaction 
                                                                      ? 'bg-amber-500/10 text-amber-400'
                                                                      : isExpired 
                                                                           ? 'bg-red-500/10 text-red-400' 
                                                                           : 'bg-green-500/10 text-green-400'
                                                            }`}>
                                                                 {hasPendingTransaction ? (
                                                                      <>
                                                                           <Calendar className="w-4 h-4" />
                                                                           Pending Approval
                                                                      </>
                                                                 ) : isExpired ? (
                                                                      <>
                                                                           <XCircle className="w-4 h-4" />
                                                                           Expired
                                                                      </>
                                                                 ) : (
                                                                      <>
                                                                           <CheckCircle className="w-4 h-4" />
                                                                           Active
                                                                      </>
                                                                 )}
                                                            </span>
                                                       </div>
                                                  </div>
                                             ) : (
                                                  <div className="space-y-4">
                                                       <div className="bg-gray-800 p-8 rounded-lg text-center">
                                                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                                                            <p className="text-gray-400 font-medium">No active subscription</p>
                                                            <p className="text-sm text-gray-500 mt-1">Select a plan below to get started</p>
                                                       </div>
                                                       
                                                       {/* Subscription Plan Selector */}
                                                       <div>
                                                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                                                 Choose Subscription Plan
                                                            </label>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                 {subscriptions.map((sub) => (
                                                                      <button
                                                                           key={sub.id}
                                                                           onClick={() => setSelectedSub(sub)}
                                                                           className={`p-4 rounded-lg border-2 text-left transition-all ${
                                                                                selectedSub?.id === sub.id
                                                                                     ? 'border-blue-600 bg-blue-500/10'
                                                                                     : 'border-gray-700 hover:border-blue-500 bg-gray-800'
                                                                           }`}
                                                                      >
                                                                           <div className="flex items-start justify-between">
                                                                                <div className="flex-1">
                                                                                     <div className="flex items-center gap-2 mb-1">
                                                                                          <h4 className="font-bold text-white">{sub.name}</h4>
                                                                                          {selectedSub?.id === sub.id && (
                                                                                               <CheckCircle className="w-5 h-5 text-blue-600" />
                                                                                          )}
                                                                                     </div>
                                                                                     <p className="text-sm text-gray-400 mb-2">{sub.description}</p>
                                                                                     <div className="flex items-baseline gap-1">
                                                                                          <span className="text-2xl font-bold text-white">
                                                                                               RWF {(sub.price * USDRate).toLocaleString()}
                                                                                          </span>
                                                                                          <span className="text-sm text-gray-500">
                                                                                               / {sub.name === "Member" ? "year" : "3 months"}
                                                                                          </span>
                                                                                     </div>
                                                                                </div>
                                                                           </div>
                                                                      </button>
                                                                 ))}
                                                            </div>
                                                            {subscriptions.length === 0 && (
                                                                 <p className="text-sm text-gray-500 text-center py-4">
                                                                      No subscription plans available. Please create one first.
                                                                 </p>
                                                            )}
                                                       </div>
                                                  </div>
                                             )}
                                        </div>

                                        {/* Transaction History */}
                                        {hasPendingTransaction && (
                                             <div>
                                                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                       <div className="w-1 h-6 bg-blue-600 rounded"></div>
                                                       Transaction History
                                                  </h3>
                                                  <div className="space-y-3">
                                                       {client.subscription?.transactions.map((transaction) => (
                                                            <div key={transaction.id} className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                                                 <div className="flex items-start justify-between mb-3">
                                                                      <span className="font-semibold text-white">Transaction #{transaction.id}</span>
                                                                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold">
                                                                           Pending
                                                                      </span>
                                                                 </div>
                                                                 <div className="grid grid-cols-2 gap-3 text-sm">
                                                                      <div>
                                                                           <p className="text-gray-400">Amount</p>
                                                                           <p className="font-semibold text-white">RWF {transaction.amount.toLocaleString()}</p>
                                                                      </div>
                                                                      <div>
                                                                           <p className="text-gray-400">Method</p>
                                                                           <p className="font-medium text-white">{transaction.transactionMethod}</p>
                                                                      </div>
                                                                      <div>
                                                                           <p className="text-gray-400">Pay Number</p>
                                                                           <p className="font-medium text-white">{transaction.payNumber}</p>
                                                                      </div>
                                                                      <div>
                                                                           <p className="text-gray-400">Date</p>
                                                                           <p className="font-medium text-white">
                                                                                {new Date(transaction.createdAt).toLocaleDateString()}
                                                                           </p>
                                                                      </div>
                                                                 </div>
                                                                 {transaction.proof && (
                                                                      <div className="mt-3 pt-3 border-t border-amber-500/20">
                                                                           <a 
                                                                                href={transaction.proof} 
                                                                                target="_blank" 
                                                                                rel="noopener noreferrer"
                                                                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 font-medium"
                                                                           >
                                                                                <Eye className="w-4 h-4" />
                                                                                View Payment Proof
                                                                           </a>
                                                                      </div>
                                                                 )}
                                                            </div>
                                                       ))}
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </div>

                              {/* Dialog Footer */}
                              <div className="border-t border-gray-800 bg-gray-800/50 p-6">
                                   <div className="flex items-center justify-between gap-3">
                                        <button
                                             onClick={() => setShowDialog(false)}
                                             className="px-6 py-2 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                                        >
                                             Close
                                        </button>
                                        <div className="flex items-center gap-3">
                                             {/* Active Subscription - Update/Cancel Options */}
                                             {isActive && (
                                                  <>
                                                       <button
                                                            onClick={handleCancelSubscription}
                                                            disabled={isProcessing}
                                                            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                       >
                                                            <XCircle className="w-4 h-4" />
                                                            Cancel Subscription
                                                       </button>
                                                  </>
                                             )}

                                             {/* Pending Subscription - Approve/Reject Options */}
                                             {hasPendingTransaction && (
                                                  <>
                                                       <button
                                                            onClick={handleRejectSubscription}
                                                            disabled={isProcessing}
                                                            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                       >
                                                            <XCircle className="w-4 h-4" />
                                                            Reject Request
                                                       </button>
                                                       <button
                                                            onClick={handleApproveSubscription}
                                                            disabled={isProcessing}
                                                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                       >
                                                            <CheckCircle className="w-4 h-4" />
                                                            Approve Request
                                                       </button>
                                                  </>
                                             )}

                                             {/* Expired Subscription - Renew Option */}
                                             {isExpired && !hasPendingTransaction && (
                                                  <button
                                                       onClick={handleRenewSubscription}
                                                       disabled={isProcessing}
                                                       className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                  >
                                                       <Calendar className="w-4 h-4" />
                                                       Renew Subscription
                                                  </button>
                                             )}

                                             {/* No Subscription - Create Option */}
                                             {!hasSubscription && (
                                                  <button
                                                       onClick={handleCreateSubscription}
                                                       disabled={isProcessing || !selectedSub}
                                                       className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                       title={!selectedSub ? "Please select a subscription plan first" : "Create subscription"}
                                                  >
                                                       <Plus className="w-4 h-4" />
                                                       {isProcessing ? "Creating..." : "Create Subscription"}
                                                  </button>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}
          </>
     )
}
