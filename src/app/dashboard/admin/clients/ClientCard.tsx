
import { getDate } from "@/util/DateFunctions"
import { TAdminClientSelect } from "./ClientsContainer"
import Image from "@/components/ui/Image"


const ClientCard = ({client}:{client: TAdminClientSelect}) => {
     return (
          <div className="w-full flex flex-col  items-center justify-center bg-gray-900 border border-gray-800 rounded-xl p-3 gap-3">
               <div className="w-full flex items-center justify-start gap-3 overflow-x-hidden">
                    <Image src={client.user.image} alt={client.user.email} width={50} height={50} className="rounded-full"  />
                    <div className="w-auto flex flex-col gap-[5px]">
                         <h3 className="w-full text-base font-bold text-gray-100 leading-3">{client.name}</h3>
                         <p className="w-full text-gray-400 text-sm">{client.phone}</p>
                    </div>
               </div>
               <div className="w-full flex flex-col items-start gap-[5px] ">
                    <p className="text-sm text-gray-400 ">Subscription: <b className="text-gray-200">{client.subscription?.subscription.name || "No Subscription"}</b></p>
                    <p className="text-sm text-gray-400 ">Expires At: <b className="text-gray-200">{client.subscription?.expiryAt ? getDate(client.subscription?.expiryAt) : "Not set"}</b></p>
               </div>
          </div>
     )
}

export default ClientCard