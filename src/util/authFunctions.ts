import Endpoints from "@/services/Endpoints";
import { ClientServer, } from "@/services/Server";
import Cookies from 'js-cookie';

export async function customLogin(userEmail:string, password:string) {
     try {
          const res = await ClientServer.post({ userEmail, password }, Endpoints.auth.login);
          if (res) {
               const {token, permissions, role}:{token:string, permissions: Array<string>, role:string} = res; 
               Cookies.set("authToken", token, {expires: 1});
               return {role, permissions};
               // const result = await signIn("credentials", {
               //      redirect: false, 
               //      token: token,  
               // });
               // if (result && !result.error) {
               //      return {role,user};
               // } else {
               //      console.error("Error signing in:", result?.error);
               //      return null;
               // }
          } else {
               return null;
          }
     } catch (error) {
          console.error("Error during login:", error);
          return null;
     }
}

export async function customLogout () {
     try{
          const token = Cookies.get('authToken');
          const res = await ClientServer.get(`${Endpoints.auth.logout}?token=${token}`);
          if(res) {
               Cookies.remove('authToken');
               return res;
          }else {
               return null;
          }
     }catch(error){
          console.log(error);
          return null;
     }
}


