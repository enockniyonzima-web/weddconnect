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
import { Transaction } from "@prisma/client";
import { createTransaction } from "@/server-actions/transaction.action";


const PaymentOptions = ({user, subscriptions}:{user:TUser, subscriptions: TSubscription[]}) => {
     const price = 5000;
     const [amount, setAmount] = useState(0);
     const [method, setMethod] = useState("");
     const subscription = subscriptions[0] ||null;

     useEffect(() => {
          if(method === "Bank" || method === "Mobile Money") {
               showMainNotification("Automatic payment has been disabled. Please, Use direct payment for now!", ENotificationType.WARNING);
          }
     },[method])

     return (
          <div className="w-full lg:w-[70%] bg-white rounded-[5px] p-[10px] flex flex-col items-center justify-start gap-[20px] mx-auto">
               <div className="w-full flex flex-col items-center justify-normal gap-[5px]">
                    <h1 className="text-[1.4rem] font-bold text-black text-center">Subscribe to our Premium plans</h1>
                    <p className="text-[0.9rem] text-gray-600 text-center">view the best and trusted wedding vendors in Rwanda by subscribing to our premium membership plan </p>
               </div>
               {amount === 0 ? 
                    <div className="w-full flex flex-col items-center justify-start gap-[10px] rounded-[5px] p-[10px] bg-gray-200">
                         <h2 className="text-center text-[1.6rem] font-extrabold text-black">Choose Duration</h2>
                         <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-[15px]">
                              <DurationCard price={price} months={1} label="A month" action={(res) => setAmount(res)}  />
                              <DurationCard price={price} months={3} label="3 months" action={(res) => setAmount(res)}  />
                              <DurationCard price={price} months={6} label="6 mnths" action={(res) => setAmount(res)}  />
                              <DurationCard price={price} months={12} label="A Year" action={(res) => setAmount(res)}  />
                         </div>
                    </div>:
                    <div className="w-full flex flex-col items-center justify-start gap-[10px] rounded-[5px] p-[10px] border border-gray-200">
                         <h2 className="text-center text-[1.6rem] font-extrabold text-black">Choose Payment Method</h2>
                         <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-[10px]">
                              <PaymentOptionCard image={VisaImage} name="Bank" action={(res) => setMethod(res)} />
                              <PaymentOptionCard image={MomoImage} name="Mobile Money" action={(res) => setMethod(res)} />
                              <PaymentOptionCard image={MtnImage} name="Direct Mtn" action={(res) => setMethod(res)} />
                         </div>
                    </div>
               }
               {
                    method === "Direct Mtn" ? 
                         <MtnDirectPayment price={price} subscription={subscription} user={user} amount={amount} />
                    :null
               }
          </div>
     )
}

const DurationCard = ({price, months, label,action}:{price:number,label:string, months:number, action:(res:number) => unknown}) => {
     return (
          <div className="w-full bg-white flex flex-col items-center justify-start gap-[5px] rounded-[5px]  p-[5px]">
               <h4 className="text-gray-600 text-[1rem] font-bold text-center">{label}</h4>
               <span className="text-blue-800 text-[1.4rem] font-semibold">{formatPrice(months * price)}</span>
               <button className="w-full p-[5px] bg-blue-600 text-[0.9rem] text-white hover:bg-blue-800 rounded-[5px]" onClick={() => action(months * price)}>Choose Package</button>
          </div>
     )
}

const PaymentOptionCard = ({image, name,action}:{image: StaticImport, name:string, action: (res:string) => unknown}) => {
     return (
          <div className="w-full rounded-[5px] p-[5px] flex flex-col items-center justify-start gap-[5px]">
               <Image src={image} placeholder="blur" alt={name} className="w-full aspect-video rounded-[5px] object-cover" />
               <h3 className="text-gray-600 text-[1rem] font-bold text-center">{name}</h3>
               <button className="w-full p-[5px] bg-orange-600 text-[0.9rem] text-white hover:bg-orange-800 rounded-[5px]" onClick={() => action(name)}>Pay Now</button>
          </div>
     )
}

const MtnDirectPayment = ({amount, price,user, subscription}:{amount: number, user:TUser, subscription: TSubscription | null, price: number}) => {
     const [phone,setPhone] = useState<string>("");
     const [isMobile, setIsMobile] = useState(false);
     const [paymentDone, setPaymentDone] = useState<boolean>(false)
     const [loading,setLoading] = useState<boolean>(false);
     const router = useRouter();

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
               let clientSubscription = user.client?.subscription;

               if(clientSubscription){
                    clientSubscription = await updateClientSubscription(clientSubscription.id, {expiryAt: getFutureDate(1), updatedAt: new Date()});
               }else {
                    clientSubscription = await createClientSubscription({createdAt: new Date(), updatedAt: new Date(), expiryAt: getFutureDate(1), client: {connect:{id: user.client?.id || 0}}, subscription:{connect: {id: subscription?.id || 0}} })
               }
               if(isMobile) {
                    setPaymentDone(true);
                    router.push(`tel:*182*1*1*0780795232*${amount}`);
               }else{
                    alert(`Using the number: ${phone}, Dial *182*1*1*0780795232*${amount} to complete he payment.`);
                    setPaymentDone(true);
               }

               const newTransaction = clientSubscription ? await createTransaction({amount, quantity: amount / price, price, createdAt: new Date(), updatedAt: new Date() , status: "pending", payNumber: phone, transactionMethod: "Direct Mtn", clientSubscription: {connect:{id: clientSubscription.id}} }) : null;
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