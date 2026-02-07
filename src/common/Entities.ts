import { Prisma } from '@prisma/client';

export const SSessionUser = {
     id:true, email:true, image:true, status:true, type:true, createdAt:true,
     admin: {select: {id:true, name:true, role:true}},
     client: {select :{
          id:true, name:true, phone:true, 
          subscription: {select: {
               id:true, 
               expiryAt:true,
               updatedAt:true,
               transactions: {select:{createdAt:true}, orderBy:{createdAt:"desc"}, take: 1},
               subscription: {select: {id:true, name:true, price:true}}
          }}
     }}
} satisfies Prisma.UserSelect;
export type TSessionUser = Prisma.UserGetPayload<{select: typeof SSessionUser}>;

// select fields
export type TUserSelectFields = {
     id:true,email: true, image: true, status:true, type: true, createdAt:true,
}  
export type TUser = Prisma.UserGetPayload<{select: TUserSelectFields,include: {client: {include:{subscription:true}}, vendor: true, admin:true}}>;

export type TCategory = Prisma.CategoryGetPayload<{select:{id:true, name:true, status:true, icon:true, description:true},include: {features:true, _count:{select:{posts:true}}}}>;
export type TPostFeature = Prisma.PostFeatureGetPayload<{include: {categoryFeature: true}}>
export type TPost  = Prisma.PostGetPayload<{include:
     {
          price:true, images:true, packages:true,
          features:{include: {categoryFeature:true}}, 
          _count: {
               select:{
                    likes:true,
                    reviews:true
               }
          },
          vendor: {include:{user:{select: TUserSelectFields}, contacts:{include: {contactType:true}}}}, category: true
     }}>

export type TVendor = Prisma.VendorGetPayload<{include:{user:{select: TUserSelectFields},contacts:{include: {contactType:true}}} }>
export type TVendorContact = Prisma.VendorContactGetPayload<{include: {contactType: true}}>

export type TClient = Prisma.ClientGetPayload<{include: {user: {select:TUserSelectFields}, subscription:{include:{subscription:true}}}}>
export const SSubscription = {
     id:true, name:true, price:true, description:true,
     _count:{select:{clientSubscriptions:true}}
} satisfies Prisma.SubscriptionSelect;
export type TSubscription = Prisma.SubscriptionGetPayload<{select: typeof SSubscription}>;
export type TClientSubscription = Prisma.ClientSubscriptionGetPayload<{include: {subscription:true, client:true}}>
export type TTransaction = Prisma.TransactionGetPayload<{include: {clientSubscription:{include:{client:true}}, Subscription:true}}>