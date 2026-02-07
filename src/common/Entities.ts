
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

export const SVendorContact = {
     id:true, value:true, vendorId:true, contactTypeId:true,contactType: {select: {id:true, name:true, type:true,description:true}}
} satisfies Prisma.VendorContactSelect;
export type TVendorContact = Prisma.VendorContactGetPayload<{select: typeof SVendorContact}>

// select fields
export type TUserSelectFields = {
     id:true,email: true, image: true, status:true, type: true, createdAt:true,
}  
export type TUser = Prisma.UserGetPayload<{select: TUserSelectFields,include: {client: {include:{subscription:true}}, vendor: true, admin:true}}>;

export type TCategory = Prisma.CategoryGetPayload<{select:{id:true, name:true, status:true, icon:true, description:true},include: {features:true, _count:{select:{posts:true}}}}>;

export const SPostFeature = {
     id:true, value:true, postId:true, categoryFeature: {select: {id:true, name:true, type:true, icon:true, onCard:true, rank:true, inFilter:true}}
} satisfies Prisma.PostFeatureSelect;
export type TPostFeature = Prisma.PostFeatureGetPayload<{select: typeof SPostFeature}>;

export const SPostPage = {
     id:true, title:true, description:true, status:true, createdAt:true, location: true,
     category: {select: {id: true, name:true}},
     vendor: {select: {id:true, name:true, contacts: {select: SVendorContact}}},
     price: {select: {id:true, min:true, max:true,currency:true, }},
     packages: {select: {id:true, name:true, description:true, price:true}},
     images: {select: {id:true, url:true, name:true, postId:true }},
     features: {select: SPostFeature},
     _count: {select: {likes:true, reviews:true}}
} satisfies Prisma.PostSelect;
export type TPostPage = Prisma.PostGetPayload<{select: typeof SPostPage}>

export const SPost = {
     id:true, title:true, description:true, status:true, createdAt:true, location: true, categoryId:true,
     price: true,
     category: {select: {id: true, name:true}},
     vendor: {
          select: {
               id:true, name:true, status:true, userId:true,
               user: {select: {id:true,email: true, image: true, status:true, type: true, createdAt:true,}}, contacts: {select: SVendorContact}
          }
     },
     images: {select: {id:true, url:true, name:true, postId:true }},
     features: {select: SPostFeature},
     _count: {
          select:{
               likes:true,
               reviews:true
          }
     },

} satisfies Prisma.PostSelect;
export type TPost  = Prisma.PostGetPayload<{select: typeof SPost}>

export type TVendor = Prisma.VendorGetPayload<{include:{user:{select: TUserSelectFields},contacts:{include: {contactType:true}}} }>

export type TClient = Prisma.ClientGetPayload<{include: {user: {select:TUserSelectFields}, subscription:{include:{subscription:true}}}}>
export const SSubscription = {
     id:true, name:true, price:true, description:true,
     _count:{select:{clientSubscriptions:true}}
} satisfies Prisma.SubscriptionSelect;
export type TSubscription = Prisma.SubscriptionGetPayload<{select: typeof SSubscription}>;
export type TClientSubscription = Prisma.ClientSubscriptionGetPayload<{include: {subscription:true, client:true}}>
export type TTransaction = Prisma.TransactionGetPayload<{include: {clientSubscription:{include:{client:true}}, Subscription:true}}>