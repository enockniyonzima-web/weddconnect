/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { fetchWrapper } from "./fetchWrapper";
import { revalidatePath } from "next/cache";
const publicApi = process.env.NEXT_PUBLIC_SERVER_API_URL;
const privateApi  = process.env.SERVER_API_URL
// const publicApi = '/api';
// const privateApi = '/api';

export const ClientServer =  {
     post: async (data:any, endpoint:string) => {
          try {
               const res = await axios.post(`${publicApi}/${endpoint}`, data);
               return res.data;
          } catch (error) {
               return null;
          }
     },
     fetch: async (endpoint: string) => {
          const url = `${publicApi}/${endpoint}`;
          return fetchWrapper(url, { method: 'GET' });
     },
     get:async (endpoint:string, ) => {
          try{
               const res = await axios.get(`${publicApi}/${endpoint}`);
               return res.data;
          }catch(error){
               console.log(error);
               return null
          }
     },
     getWithParams:async (endpoint:string, params:any) => {
          try{
               if(params) {
                    const res = await axios.get(`${publicApi}/${endpoint}`, {params: params});
                    return res.data;
               }
               const res = await axios.get(`${publicApi}/${endpoint}`);
               return res.data;
          }catch(error){
               // console.log(error);
               return null
          }
     },
     patch: async (data:any, endpoint:string) => {
          try {
               const res = await axios.patch(`${publicApi}/${endpoint}`, data);
               return res.data;
          } catch (error) {
               // console.log(error);
               return null;
          }
     },
     delete: async(endpoint:string) => {
          try {
               const res = await axios.delete(`${publicApi}/${endpoint}`);
               return res.data
          } catch (error) {
               // console.log(error);
               return null
          }
     }
}

export const MainServer = {
     post: async (data:any, endpoint:string) => {
          try {
               const res = await axios.post(`${privateApi}/${endpoint}`, data);
               return res.data;
          } catch (error) {
               // console.log(error);
               return null;
          }
     },
     fetch: async (endpoint: string) => {
          const url = `${privateApi}/${endpoint}`;
          return await fetchWrapper(url, { method: 'GET' });
     },
     get:async (endpoint:string, ) => {
          try{
               const res = await axios.get(`${privateApi}/${endpoint}`);
               return res.data;
          }catch(error){
               // console.log(error);
               return null
          }
     },
     getWithParams:async (endpoint:string, params:any) => {
          try{
               if(params) {
                    const res = await axios.get(`${privateApi}/${endpoint}`, {params: params});
                    return res.data;
               }
               const res = await axios.get(`${privateApi}/${endpoint}`);
               return res.data;
          }catch(error){
               // console.log(error);
               return null
          }
     },
     patch: async (data:any, endpoint:string) => {
          try {
               const res = await axios.patch(`${privateApi}/${endpoint}`, data);
               return res.data;
          } catch (error) {
               // console.log(error);
               return null;
          }
     },
     delete: async(endpoint:string) => {
          try {
               const res = await axios.delete(`${privateApi}/${endpoint}`);
               return res.data
          } catch (error) {
               // console.log(error);
               return null
          }
     }

}

export const RevalidatePages = {
     categoryFeature: () => {
          revalidatePath('/');
     },
     category: () => {
          revalidatePath('/');
     },
     contactType: () => {
          revalidatePath('/');
     },
     permission: () => {
          revalidatePath('/');
     },
     postLike: () => {
          revalidatePath('/');
     },
     postReview: () => {
          revalidatePath('/');
     },
     post: () => {
          revalidatePath('/');
     },
     role: async () => {
          revalidatePath('/');
     },
     service: () => {
          revalidatePath('/');
     },
     user: () => {
          revalidatePath('/');
     },
     vendor: () => {
          revalidatePath('/');
     },
     admin: () => {
          revalidatePath('/');
     },
     client: () => {
          revalidatePath('/');
     },
     transaction: () => {
          revalidatePath('/');
     },
     subscription: () => {
          revalidatePath('/');
     },
     clientSubscription: () => {
          revalidatePath('/');
     }
}
