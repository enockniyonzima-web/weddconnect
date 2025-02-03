import { IAppData } from "@/context/AppContext";
import Endpoints from "@/services/Endpoints";
import { MainServer } from "@/services/Server";

export const fetchAppData = async(): Promise<IAppData | null> => {
     try {
          const data:IAppData = {
               categories: [],
               listings: []
          }
     
          // const categories = await MainServer.get(Endpoints.category);
          // const listings = await MainServer.get(Endpoints.listing);
          // if(categories && Array.isArray(categories) && categories.length)data.categories = categories;
          // if(listings && Array.isArray(listings) && listings.length) data.listings = listings;
     
          return data;
     } catch (error) {
          console.log(error);
          return null
     }
}