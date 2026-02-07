/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { copyToClipboard, formatPrice } from "@/util/stringFuncs";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useEffect, useState } from "react";
import MomoImage from "../../../public/payment/momo.png";
import MtnImage from "../../../public/payment/mtn.png";
import VisaImage from "../../../public/payment/visa.png";
import { showMainNotification } from "@/util/NotificationFuncs";
import { ENotificationType } from "@/common/CommonTypes";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TSessionUser, TSubscription, TUser } from "@/common/Entities";
import { createClientSubscription, updateClientSubscription } from "@/server-actions/client-subscription.actions";
import { getFutureDate } from "@/util/DateFunctions";
import { createTransaction } from "@/server-actions/transaction.action";
import { FaCheck } from "react-icons/fa6";
import { createClient } from "@/server-actions/client.actions";
import { IoCopy } from "react-icons/io5";
import { TextInputGroup } from "../forms/DataFormsInputs";

const USDRate = 1450;

const PaymentOptions = ({user, subscriptions}:{user:TSessionUser, subscriptions: TSubscription[]}) => {
     const [choosenSub, setChoosenSub] = useState<TSubscription | null>(null);
     const [method, setMethod] = useState("");
     const [paymentDone,setPaymentDone] = useState(false);

     useEffect(() => {
          if(method === "Bank" || method === "Mobile Money") {
               showMainNotification("Automatic payment has been disabled. Please, Use direct payment for now!", ENotificationType.WARNING);
          }
     },[method])

     if(paymentDone) {
          return (
               <div className="w-full lg:w-[70%] bg-white rounded-[10px] p-[20px] flex flex-col items-center justify-start gap-[20px] mx-auto">
                    <div className="w-full flex flex-col items-center justify-normal gap-[10px]">
                    <h1 className="text-[1.6rem] font-extrabold text-black text-center">Thank you for completing your payment.</h1>
                    <p className="text-[0.9rem] text-gray-600 text-center max-w-[70%]">It usually takes five (5) minutes to 30 minutes to verify your payment. After verification, you gain full access to all wedding vendors.</p>
                    
                    <div className="w-full flex flex-col items-center justify-start gap-[10px] border border-gray-200 rounded-[10px] p-[20px]">
                         <p className="text-[1rem] font-bold text-gray-800">Contact us to complete verification process if it is taking long.</p>
                         <div className="w-full grid grid-cols-2 gap-[20px]">
                              <Link href={`tel:0788399021`} className="w-full text-center p-[10px] bg-blue-600 text-[0.9rem] text-white hover:bg-blue-800 rounded-[10px] disabled:bg-gray-600" target="_blank">Call Us</Link>
                              <Link href={`https://wa.me/+250788399021`}  className="w-full text-center p-[10px] bg-green-600 text-[0.9rem] text-white hover:bg-green-800 rounded-[10px] disabled:bg-gray-600" >Send us Message</Link>
                         </div>
                         
                    </div>
               </div>
               </div>
          )
     }

     return (
          <div className="w-full lg:w-[70%] bg-white rounded-[10px] p-[20px] flex flex-col items-center justify-start gap-[20px] mx-auto">
               <div className="w-full flex flex-col items-center justify-normal gap-[10px]">
                    <h1 className="text-[1.6rem] font-extrabold text-black text-center">{choosenSub ? "Complete payment" :"Choose you membership Plan"}</h1>
                    <p className="text-[0.9rem] text-gray-600 text-center">View the best and trusted wedding vendors in Rwanda by subscribing to our premium membership plan </p>
               </div>
               {choosenSub === null ? 
                         <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
                              {
                                   subscriptions.sort((a,b) => a.price - b.price).map(sub => <SubscriptionCard key={`subscription-card-${sub.id}`} subscription={sub} action={(newSub) => setChoosenSub(newSub)} />)
                              }
                         </div>:
                         <MtnDirectPayment subscription={choosenSub} user={user} action={() => setPaymentDone(true)}/>
                    // <div className="w-full flex flex-col items-center justify-start gap-[10px] rounded-[5px] p-[10px] border border-gray-200">
                    //      <h2 className="text-center text-[1.4rem] font-bold text-black">Choose Payment Method</h2>
                    //      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-[10px]">
                    //           <PaymentOptionCard image={VisaImage} name="Bank" action={(res) => setMethod(res)} />
                    //           <PaymentOptionCard image={MomoImage} name="Mobile Money" action={(res) => setMethod(res)} />
                    //           <PaymentOptionCard image={MtnImage} name="Direct Mtn" action={(res) => setMethod(res)} />
                    //      </div>
                    // </div>
               }
               {/* {
                    method === "Direct Mtn" && choosenSub !== null ? 
                         <MtnDirectPayment subscription={choosenSub} user={user}/>
                    :null
               } */}
          </div>
     )
}

const SubscriptionCard = ({subscription, action}:{subscription: TSubscription, action:(subscription:TSubscription) => void}) => {
     return (
          <div className="w-full bg-gradient-to-br from-gray-800 to-black flex flex-col items-center justify-start gap-[20px] rounded-[10px]  p-[20px]">
               <div className="w-full flex flex-col items-center justify-start gap-[10px]">
                    <h3 className="text-[1.4rem] font-bold text-center text-white">{subscription.name}</h3>
                    <h4 className="text-center text-blue-300 text-[1.6rem] font-bold">${formatPrice(subscription.price)}</h4>
               </div>
               <div className="w-full flex flex-col items-start justify-start gap-[10px]">
                    {
                         subscription.description.split(';').map((desc, index) => <p className="text-[1rem] text-white flex items-center justify-center gap-[5px] " key={`${subscription.name}-${index}`}><i className="text-[1.2rem] text-green-600"><FaCheck/></i>{desc}</p>)
                    }
               </div>
               <div className="w-full flex items-center justify-center">
                    <button type="button" className="w-auto py-[10px] px-[20px] text-white bg-gradient-to-br from-blue-600 to-blue-800 rounded-[30px]" onClick={() => action(subscription)}>Choose Plan</button>
               </div>
          </div>
     )
}

const PaymentOptionCard = ({image, name,action}:{image: StaticImport, name:string, action: (res:string) => unknown}) => {
     return (
          <div className="w-full rounded-[5px] p-[5px] flex flex-col items-center justify-start gap-[5px]">
               <Image src={image} placeholder="blur" alt={name} className="w-full aspect-video rounded-[5px] object-cover" />
               <h3 className="text-gray-600 text-[1rem] font-bold text-center">{name}</h3>
               <button type="button" className="w-full p-[5px] bg-orange-600 text-[0.9rem] text-white hover:bg-orange-800 rounded-[5px]" onClick={() => action(name)}>Pay Now</button>
          </div>
     )
}

const MtnDirectPayment = ({user, subscription, action}:{user:TSessionUser, subscription: TSubscription, action:() => void}) => {
     const [phone,setPhone] = useState<string>("");
     const [names,setNames] = useState("");
     const [paymentDone, setPaymentDone] = useState<boolean>(false)
     const [loading,setLoading] = useState<boolean>(false);
     const [method,setMethod] = useState("");
     const router = useRouter();
     const expiryDate = getFutureDate(-1);
     
     const amount = subscription.price * USDRate;

     

     const completePayment = async () => {
          try {
               setLoading(true);

               if(phone === "") return showMainNotification("Invalid phone number. User the international format: +XXXX...", ENotificationType.WARNING); 
               const clientAcc  = user.client ? user.client : await createClient({name: user.email, phone: phone, user: {connect: {id: user.id}}});
               const clientSubscription = user.client?.subscription;

               if(clientSubscription){
                    const response = await updateClientSubscription(clientSubscription.id, {
                         expiryAt: null, updatedAt: new Date(),
                         transactions: {
                              create: {amount, quantity: 1, price: amount, createdAt: new Date(), updatedAt: new Date() , status: "pending", payNumber: phone, transactionMethod: method, proof: names}
                         }
                    });
                    if(!response) return showMainNotification("Error updating subscription. Try again later", ENotificationType.FAIL);
               }else {
                    const response = await createClientSubscription({
                         createdAt: new Date(), updatedAt: new Date(), expiryAt: null, client: {connect:{id: clientAcc?.id}},subscription:{connect: {id: subscription?.id || 0}},
                         transactions: {create: {amount, quantity: 1, price: amount, createdAt: new Date(), updatedAt: new Date() , status: "pending", payNumber: phone, transactionMethod: method, proof: names}}
                    })
                    if(!response) return showMainNotification("Error creating subscription. Try again later", ENotificationType.FAIL);
               }
               

               showMainNotification("Payment recorded successfully", ENotificationType.PASS);
               return action();
          } catch (error) {
               showMainNotification("Application error. Try again later", ENotificationType.FAIL);
          }finally{
               setLoading(false);
          }
          

     }

     const copyText = async(str:string) => {
          const result = await copyToClipboard(str);
          if(result) return showMainNotification("Copied to clipboard", ENotificationType.PASS);
          else return showMainNotification("Error copying the text. Try again", ENotificationType.FAIL);
     }

     return (
          <div className="w-full flex flex-col items-center gap-[5px]">
               {
                    !paymentDone ?
                    <div className="w-full flex flex-col items-center justify-start gap-[20px] px-[20px] ">
                         {
                              method === "" ? 
                                   <>
                                        <h3 className="text-[1.4rem] font-bold text-blue-950">Pay to one of these accounts:</h3>
                                        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
                                             <div className="w-full flex flex-col items-start justify-start gap-[5px] p-[10px] rounded-[10px] border-[1.2px] border-gray-300">
                                                  <p className="text-[1rem] text-gray-800">Vendor: <b className="text-[1rem] text-orange-800">MTN</b></p>
                                                  <p className="text-[1rem] text-gray-800">Amount: <b className="text-[1rem] text-orange-800">Rwf {formatPrice(subscription.price * USDRate)}</b></p>
                                                  <p className="text-[1rem] text-gray-800">Account Names: <b className="text-[1rem] text-orange-800">Enock Niyonzima</b></p>
                                                  <p className="text-[1rem] text-gray-800 flex items-center gap-[2.5px]">Account Number: <b className=" text-[1.2rem] text-orange-800">0788399021</b> <IoCopy className="text-blue-600 hover:text-blue-800 text-[24px] cursor-pointer" onClick={async() => await copyText("0788399021")} /></p>
                                                  <div className="w-full flex flex-wrap items-center justify-start gap-[10px]">
                                                       <Link href={`tel:*182*1*1*0788399021*${subscription.price * USDRate}#`} onClick={() => setMethod("Mtn")} className="w-full text-center p-[10px] bg-blue-600 text-[0.9rem] text-white hover:bg-blue-800 rounded-[10px] disabled:bg-gray-600" target="_blank">Pay Now</Link>
                                                       {/* <p className="text-[1rem] text-gray-800">OR</p>
                                                       <button onClick={() => setMethod("Mtn")} type="button" className="w-full lg:w-[40%] p-[10px] bg-green-600 text-[0.9rem] text-white hover:bg-green-800 rounded-[10px] disabled:bg-gray-600" >Already Paid</button> */}
                                                  </div>
                                             </div>   
                                             <div className="w-full flex flex-col items-start justify-start gap-[5px] p-[10px] rounded-[10px] border-[1.2px] border-gray-300">
                                                  <p className="text-[1rem] text-gray-800">Vendor: <b className="text-[1rem] text-orange-800">Equity Bank</b></p>
                                                  <p className="text-[1rem] text-gray-800">Amount: <b className="text-[1rem] text-orange-800">Rwf {formatPrice(subscription.price * USDRate)}</b></p>
                                                  <p className="text-[1rem] text-gray-800">Account Names: <b className="text-[1rem] text-orange-800">Enock Niyonzima</b></p>
                                                  <p className="text-[1rem] text-gray-800 flex items-center gap-[2.5px]">Account Number: <b className=" text-[1.2rem] text-orange-800">4012100596469</b> <IoCopy className="text-blue-600 hover:text-blue-800 text-[24px] cursor-pointer" onClick={async() => await copyText("4012100596469")} /></p>
                                                  <div className="w-full flex flex-wrap items-center justify-start gap-[10px]">
                                                       <Link href={`tel:*555*3*2*2*4012100596469*${subscription.price * USDRate}#`} onClick={() => setMethod("Equity")} className="w-full text-center  p-[10px] bg-blue-600 text-[0.9rem] text-white hover:bg-blue-800 rounded-[10px] disabled:bg-gray-600" target="_blank">Pay Now</Link>
                                                       {/* <p className="text-[1rem] text-gray-800">OR</p>
                                                       <button onClick={() => setMethod("Equity")} type="button" className="w-auto lg:w-[40%] p-[10px] bg-green-600 text-[0.9rem] text-white hover:bg-green-800 rounded-[10px] disabled:bg-gray-600" >Already Paid</button> */}
                                                  </div>
                                             </div> 
                                             
                                        </div>
                                   </>
                              :
                              <form onSubmit={completePayment} className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[20px] rounded-[10px] p-[10px] border-[1.2px] border-gray-300">
                                   <h3 className="w-full text-[1rem] font-bold lg:col-span-2">Please provide your payment details.</h3>
                                   <TextInputGroup name="name" label="Names: " placeholder="Enter you payment names" required type="text"action={res => setNames(String(res))} />
                                   <TextInputGroup name="phone" label="Account/Phone Number: " placeholder="Enter your account or phone number.." required type="text" action={res => setPhone(String(res).trim())} />
                                   <button type="button" disabled={loading} className="w-full lg:w-[40%] p-[10px] bg-blue-600 text-[0.9rem] text-white hover:bg-blue-800 rounded-[10px] disabled:bg-gray-600" onClick={completePayment}>{loading? "Loading...":"Complete Payment"}</button>
                              </form>
                         }
                         
                         
                    </div>
                    :
                    <>
                         <p className="text-center text-[0.8rem] text-gray-700">Click below if you have compeleted the payment click <b>Proceed</b> else <b>Cancel</b> to start over. Before your payment is verified you will have limited rights to view the posts.</p>
                         <div className="w-auto flex items-center justify-center gap-[10px]">
                              <button className="w-auto p-[5px] bg-orange-600 px-[20px] rounded-[5px] text-[0.9rem] text-white hover:bg-orange-800 " type="button" onClick={() => setPaymentDone(false)} >Reset</button>
                              <Link prefetch={true} href={'/posts'} className="w-auto p-[5px] bg-green-600 px-[20px] rounded-[5px] text-[0.9rem] text-white hover:bg-green-800 ">Proceed</Link>
                         </div>
                    </>
               }
               
          </div>
     )
}



export default PaymentOptions