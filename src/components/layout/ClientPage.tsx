import { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"
import QuickAuth from "../auth/QuickAuth"

const ClientPage = ({children}:{children: ReactNode}) => {

     return (
          <>
               <Header/>
               <main className="w-full flex flex-col items-center justify-start max-w-[1512px] mx-auto bg-white">
                    {children}
               </main> 
               <Footer />
               <QuickAuth />
          </>
     )
}

export default ClientPage