
import { getDate } from "@/util/DateFunctions"
import { TAdminClientSelect } from "./ClientsContainer"
import Image from "@/components/ui/Image"


const ClientCard = ({client}:{client: TAdminClientSelect}) => {
     return (
          <div className="w-full flex flex-col  items-center justify-center bg-white rounded-[10px] p-[10px] gap-[10px]">
               <div className="w-full flex items-center justify-start gap-[10px] overflow-x-hidden">
                    <Image src={client.user.image} alt={client.user.email} width={50} height={50} className="rounded-full"  />
                    <div className="w-auto flex flex-col gap-[5px]">
                         <h3 className="w-full text-[1rem] font-bold text-gray-800 leading-3">{client.name}</h3>
                         <p className="w-full text-gray-700 text-[0.9rem]">{client.phone}</p>
                    </div>
               </div>
               <div className="w-full flex flex-col items-start gap-[5px] ">
                    <p className="text-[0.9rem] text-gray-700 ">Subscription: <b>{client.subscription?.subscription.name || "No Subscription"}</b></p>
                    <p className="text-[0.9rem] text-gray-700 ">Expires At: <b>{client.subscription?.expiryAt ? getDate(client.subscription?.expiryAt) : "Not set"}</b></p>
               </div>
          </div>
     )
}

export default ClientCard