import { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"

const ClientPage = ({children}:{children: ReactNode}) => {
     return (
          <>
               <Header/> 
               {children}
               <Footer />
          </>
     )
}

export default ClientPage