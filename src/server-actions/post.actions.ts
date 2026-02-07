/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createPost (data: Prisma.PostCreateInput) {
     try {     
          const res = await prisma.post.create({data});
          if(res) RevalidatePages.post();
          return res;
     } catch (error) {
          console.log("Error creating Post: ", error);
          return null
     }

}

export async function updatePost (id:number,data: Prisma.PostUpdateInput) {
     try {     
          const res = await prisma.post.update({where: {id},data});
          if(res) RevalidatePages.post();
          return res;
     } catch (error) {
          console.log("Error updating Post : ", error);
          return null
     }

}

export async function deletePost (id:number) {
     try {     
          const res = await prisma.post.delete({where: {id}});
          if(res) RevalidatePages.post();
          return res;
     } catch (error) {
          console.log("Error creating Post: ", error);
          return null
     }

}

export async function deletePostFeatures (postId: number) {
     return await prisma.postFeature.deleteMany({where: {postId}});
}

// const TUserSelectFields = {
//      id:true,email: true, image: true, status:true, type: true, createdAt:true
// }

// export const fetchPosts = cache(async(params:URLSearchParams) => {
//      try{
//           const page:{skip:number, take:number} = {skip:0, take: 100};

//           const filters: any = {};
//           const priceFilters: any ={};

//           const status = params.get("status");
//           const category= params.get('category');
//           const nextPage = params.get("page");
//           const take = params.get("take");
//           const location = params.get('location');
//           const minPrice = params.get('minPrice');
//           const maxPrice  = params.get('maxPrice');

//           if(take) page.take = +take;
//           if(nextPage) page.skip = ((+nextPage - 1) * page.take);

//           if(status) filters.status = status;
//           if(category) filters.categoryId = Number(category);
//           if(location) filters.location = {contains:location}

//           //price filters
//           if(minPrice) priceFilters.min = {gte:Number(minPrice)}
//           if(maxPrice) priceFilters.max = {lte:Number(maxPrice)}
          
//           const data = await prisma.post.findMany(
//                {
//                     where: {...filters, price: priceFilters}, 
//                     include:
//                          {
//                               price:true, images:true, packages:true,
//                               features:{include: {categoryFeature:true}}, 
//                               _count: {
//                                    select:{
//                                         likes:true,
//                                         reviews:true
//                                    }
//                               },
//                               vendor: {include:{user:{select: TUserSelectFields}, contacts:{include: {contactType:true}}}}, category: true
//                     },
//                     orderBy:[{id:"desc"}]
//                }
//           );
//           const count  = await prisma.post.count({where: {...filters}});

//           return {data, pagination: {total: count}};
//      }catch(error){
//           console.log("error fetching post info", error);
//           return {Error: "Error fetching post info"};
//      }
// }); 

export const fetchPosts = cache(async <T extends Prisma.PostSelect>(
          selectType: T, search?: Prisma.PostWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<Prisma.PostGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.post.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching Posts: ", error);
          return [];
     }
});

export const fetchPostById = cache(async <T extends Prisma.PostSelect>(id:number, selectType: T): Promise<Prisma.PostGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.post.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Post data for id: ${id}`, error);
          return null;
     }
})