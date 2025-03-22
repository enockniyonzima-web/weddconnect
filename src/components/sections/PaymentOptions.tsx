/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { formatPrice } from "@/util/stringFuncs";
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
import { TSubscription, TUser } from "@/common/Entities";
import { createClientSubscription, updateClientSubscription } from "@/server-actions/client-subscription.actions";
import { getFutureDate } from "@/util/DateFunctions";
import { createTransaction } from "@/server-actions/transaction.action";
import { FaCheck } from "react-icons/fa6";
import { createClient } from "@/server-actions/client.actions";

const USDRate = 1450;

const PaymentOptions = ({user, subscriptions}:{user:TUser, subscriptions: TSubscription[]}) => {
     const [choosenSub, setChoosenSub] = useState<TSubscription | null>(null);
     const [method, setMethod] = useState("");

     useEffect(() => {
          if(method === "Bank" || method === "Mobile Money") {
               showMainNotification("Automatic payment has been disabled. Please, Use direct payment for now!", ENotificationType.WARNING);
          }
     },[method])

     return (
          <div className="w-full lg:w-[70%] bg-white rounded-[10px] p-[20px] flex flex-col items-center justify-start gap-[20px] mx-auto">
               <div className="w-full flex flex-col items-center justify-normal gap-[10px]">
                    <h1 className="text-[1.6rem] font-extrabold text-black text-center">Choose you membership Plan</h1>
                    <p className="text-[0.9rem] text-gray-600 text-center">View the best and trusted wedding vendors in Rwanda by subscribing to our premium membership plan </p>
               </div>
               {choosenSub === null ? 
                         <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
                              {
                                   subscriptions.sort((a,b) => a.price - b.price).map(sub => <SubscriptionCard key={`subscription-card-${sub.id}`} subscription={sub} action={(newSub) => setChoosenSub(newSub)} />)
                              }
                         </div>:
                    <div className="w-full flex flex-col items-center justify-start gap-[10px] rounded-[5px] p-[10px] border border-gray-200">
                         <h2 className="text-center text-[1.4rem] font-bold text-black">Choose Payment Method</h2>
                         <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-[10px]">
                              <PaymentOptionCard image={VisaImage} name="Bank" action={(res) => setMethod(res)} />
                              <PaymentOptionCard image={MomoImage} name="Mobile Money" action={(res) => setMethod(res)} />
                              <PaymentOptionCard image={MtnImage} name="Direct Mtn" action={(res) => setMethod(res)} />
                         </div>
                    </div>
               }
               {
                    method === "Direct Mtn" && choosenSub !== null ? 
                         <MtnDirectPayment subscription={choosenSub} user={user}/>
                    :null
               }
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

const MtnDirectPayment = ({user, subscription}:{user:TUser, subscription: TSubscription}) => {
     const [phone,setPhone] = useState<string>("");
     const [isMobile, setIsMobile] = useState(false);
     const [paymentDone, setPaymentDone] = useState<boolean>(false)
     const [loading,setLoading] = useState<boolean>(false);
     const router = useRouter();
     const expiryDate = getFutureDate(subscription.name === "Member" ? 1000 : 90);
     
     const amount = subscription.price * USDRate;

     useEffect(() => {
          const userAgent = navigator.userAgent.toLowerCase();
          const mobileKeywords = ["android", "iphone", "ipad", "ipod", "blackberry", "windows phone"];
  
          setIsMobile(mobileKeywords.some((keyword) => userAgent.includes(keyword)));
     }, []);

     const completePayment = async () => {
          try {
               setLoading(true);

               if(phone === "" || phone.length !== 10) return showMainNotification("Invalid phone number", ENotificationType.WARNING); 
               alert(`Confirm Payment of Rwf ${formatPrice(amount)} using phone number: ${phone}`);
               const clientAcc  = user.client ? user.client : await createClient({name: user.email, phone: phone, user: {connect: {id: user.id}}});
               let clientSubscription = user.client?.subscription;


               if(clientSubscription){
                    clientSubscription = await updateClientSubscription(clientSubscription.id, {expiryAt: expiryDate, updatedAt: new Date()});
               }else {
                    clientSubscription = await createClientSubscription({createdAt: new Date(), updatedAt: new Date(), expiryAt: expiryDate, client: {connect:{id: clientAcc?.id}}, subscription:{connect: {id: subscription?.id || 0}} })
               }
               if(isMobile) {
                    setPaymentDone(true);
                    router.push(`tel:*182*1*1*0780795232*${amount}`);
               }else{
                    alert(`Using the number: ${phone}, Dial *182*1*1*0780795232*${subscription.price * USDRate} to complete he payment.`);
                    setPaymentDone(true);
               }

               const newTransaction = clientSubscription ? await createTransaction({amount, quantity: 1, price:amount, createdAt: new Date(), updatedAt: new Date() , status: "pending", payNumber: phone, transactionMethod: "Direct Mtn", clientSubscription: {connect:{id: clientSubscription.id}} }) : null;
               if(newTransaction){
                    showMainNotification("Direct Payment recorded successfully", ENotificationType.PASS);
                    return router.push('/posts');
               }else {
                    showMainNotification("Error recording payment. Try again later please", ENotificationType.FAIL);
               }
          } catch (error) {
               showMainNotification("Application error. Try again later", ENotificationType.FAIL);
          }finally{
               setLoading(false);
          }
          

     }

     return (
          <div className="w-full flex flex-col items-center gap-[5px]">
               {
                    !paymentDone ?
                    <>
                         <label htmlFor="payment-number" className="text-[0.9rem] text-gray-600">Payment Number:</label>
                         <input onChange={(e) => setPhone(e.target.value)} type="tel" name="payment-number" inputMode="numeric" id="payment-number" className="w-auto p-[5px] outline-none bg-gray-100 border border-gray-300 rounded-[5px] text-center text-blue-600 text-[0.9rem] focus:border-blue-600" />
                         <button type="button" disabled={loading} className="w-full lg:w-[40%] p-[5px] bg-blue-600 text-[0.9rem] text-white hover:bg-blue-800 rounded-[5px] disabled:bg-gray-600" onClick={completePayment}>{loading? "Loading...":"Complete Payment"}</button>
                    </>
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