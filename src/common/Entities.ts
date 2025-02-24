import { Prisma } from "@prisma/client";

// select fields
export type TUserSelectFields = {
     id:true,email: true, image: true, status:true, type: true, createdAt:true
}

export type TUser = Prisma.UserGetPayload<{select: TUserSelectFields,include: {client: {include:{subscription:true}}, vendor: true, admin:true}}>;
export type TCategory = Prisma.CategoryGetPayload<{include: {features:true}}>;
export type TPost  = Prisma.PostGetPayload<{include:
     {
          price:true, images:true, 
          features:{include: {categoryFeature:true}}, 
          likes:true, packages:true, reviews:true,
          vendor: {include:{user:{select: TUserSelectFields}, contacts:{include: {contactType:true}}}}, category: true
     }}>

export type TVendor = Prisma.VendorGetPayload<{include:{user:{select: TUserSelectFields}}, contacts:true}>

export type TClient = Prisma.ClientGetPayload<{include: {user: {select:TUserSelectFields}, subscription:{include:{subscription:true}}}}>
export type TSubscription = Prisma.SubscriptionGetPayload<{include: {_count:{select: {clientSubscriptions:true}}}}>
export type TClientSubscription = Prisma.ClientSubscriptionGetPayload<{include: {subscription:true, client:true}}>
export type TTransaction = Prisma.TransactionGetPayload<{include: {clientSubscription:{include:{client:true}}, Subscription:true}}>