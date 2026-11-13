"use server";

import { FormState } from "@/common/CommonTypes";
import { CreateUserSchema } from "@/common/schemas";
import { createClientRecord, createUserRecord } from "@/lib/server/accounts";
import prisma from "@/lib/prisma";
import { encryptPassword } from "@/util/bcryptFuncs";
import { Prisma } from "@prisma/client";
const defaultIcon = "https://weddconnect-s3.s3.eu-north-1.amazonaws.com/production/account.png";


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

          const existing = await prisma.user.findUnique({ where: { email: validatedUser.email }, select: { id: true } });
          if (existing) return {message: "An account with this email already exists", status: "error"};

          const res = await createUserRecord(newUser);
          await createClientRecord({ name: validatedUser.name, phone: validatedUser.phone, userId: res.id });
          return {message: "User created successfully", status: "success"};     
          
     } catch (error) {
          console.log(error);
          return {message: "Something went wrong", status: "error"};
     }

}