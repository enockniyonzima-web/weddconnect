"use server";

import { FormState } from "@/common/CommonTypes";
import { CreateUserSchema } from "@/common/schemas";
import { createClient } from "@/server-actions/client.actions";
import { createUser } from "@/server-actions/user.actions";
import { RevalidatePages } from "@/services/Server";
import { encryptPassword } from "@/util/bcryptFuncs";
import { Prisma } from "@prisma/client";
const defaultIcon = "https://tiracar-bucket.s3.eu-north-1.amazonaws.com/users/account.png";


export async function registerUser(formState:FormState ,userFormData: FormData):Promise<FormState>{
     try {
          const user = {
               email: userFormData.get("sign-up-email") as string,
               password: userFormData.get("sign-up-password") as string,
               phone: userFormData.get("sign-up-phone") as string || "",
               type: "client",
               name: userFormData.get("sign-up-name") as string || "",
          };
         
             // Validate the extracted data
          const validatedUser = CreateUserSchema.parse(user);
          const password = await encryptPassword(validatedUser.password);
          const newUser:Prisma.UserCreateInput =  {
               email: validatedUser.email,
               password,
               createdAt: new Date(),
               type: user.type,
               image:defaultIcon
          };

          const res = await createUser(newUser);
          if(!res) return {message: "Error creating user", status: "error"};
          RevalidatePages.user();
          const newClient = await createClient({name: validatedUser.name, phone: validatedUser.phone, user: {connect: {id: res.id}}})
          if(newClient){
               RevalidatePages.client();
          }
          return {message: "User created successfully", status: "success"};     
          
     } catch (error) {
          console.log(error);
          return {message: "Something went wrong", status: "error"};
     }

}