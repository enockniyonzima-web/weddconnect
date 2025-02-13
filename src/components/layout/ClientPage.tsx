import { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"

const ClientPage = ({children}:{children: ReactNode}) => {
     return (
          <>
               <Header/>
               <main className="w-full flex flex-col items-center justify-start">
                    {children}
               </main> 
               <Footer />
          </>
     )
}

export default ClientPage