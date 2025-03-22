import { TPost } from "@/common/Entities";
import Endpoints from "@/services/Endpoints";
import { MainServer } from "@/services/Server";
import { PostImagesView } from "../[components]/PostImagesView";
import { formatPrice } from "@/util/stringFuncs";
import { VendorContactCard } from "../[components]/VendorContactCard";
import { LGPostFeatureCard } from "@/components/cards/PostFeatureCard";

export default async function PostPage ({params}: {params: Promise<{id: string}>}) {
     const id = (await params).id;
     let post:TPost | null = null;
     const postRes = await MainServer.fetch(`${Endpoints.posts}/${id}`);
     if(postRes){
          const {data} = postRes;
          post = data;
     }
     if(post === null) {
          return <div className="w-full py-[100px]"><p className="text-gray-600 text-[1rem] font-bold">Post not found</p></div>
     }
     return (
          <div className="w-full flex flex-col items-start gap-[10px] py-[80px] px-[2%] lg:px-[5%] bg-black">
               <div className="flex flex-col items-start justify-start gap-[10px] lg:hidden">
                    <h1 className="text-[1.6rem] font-bold text-white">{post.title}</h1>
                    <p className="text-gray-200 text-[1.2rem] font-bold">Price: <b className="text-blue-600">{post.price ? `${post.price.currency} ${formatPrice(post.price.min)} - ${formatPrice(post.price.max)} ` : 'Negotiable'}</b></p>
               </div>
               <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[40px] ">
                    <PostImagesView images={post.images} />
                    <div className="w-full flex flex-col items-start justify-start gap-[20px]">
                         <div className="hidden lg:flex flex-col items-start justify-start gap-[10px]">
                              <h1 className="text-[1.6rem] font-bold text-white">{post.title}</h1>
                              <p className="text-gray-200 text-[1.2rem] font-bold">Price: <b className="text-blue-600">{post.price ? `${post.price.currency} ${formatPrice(post.price.min)} - ${formatPrice(post.price.max)} ` : 'Negotiable'}</b></p>
                              <p className="text-[0.9rem] text-gray-400">Category: {post.category.name}</p>
                              <p className="text-[0.9rem] text-gray-400">Location: {post.location}</p>
                         </div>
                         <div className="w-full flex flex-col items-start gap-[10px] justify-start lg:hidden ">
                              <p className="text-[0.9rem] text-gray-400">Category: {post.category.name}</p>
                              <p className="text-[0.9rem] text-gray-400">Location: {post.location}</p>
                         </div>
                         {
                              post.features.length > 0 ? 
                              <div className="w-full flex flex-col items-start justify-start gap-[5px] bg-gray-900 p-[20px] rounded-[10px]">
                                   <h3 className="text-[1rem] font-bold text-gray-200">Features:</h3>
                                   <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[10px] px-[5px]">
                                   {
                                        post.features.map((feature,index) => <LGPostFeatureCard feature={feature} key={`vehicle-view-feature-${index}`} />)
                                   }
                              </div>
                              </div>
                              : null
                         }
                         <div className="w-full flex flex-col items-start gap-[5px]">
                              <h3 className="text-[1rem] font-bold text-gray-200">Description:</h3>
                              <p className="text-gray-400 text-[0.9rem]">{post.description}</p>
                         </div>
                         {
                              post.vendor.contacts.length > 0 ? 
                              <div className="w-full flex flex-col items-start justify-start gap-[10px]">
                                   <h3 className="text-[1.2rem] font-bold text-gray-200">Contact Vendor:</h3>
                                   <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-[10px]">
                                        {
                                             post.vendor.contacts.map(c => <VendorContactCard key={`vendor-contact-${c.id}`} contact={c} />)
                                        }
                                   </div>
                              </div>
                               :null
                         }
                         
                    </div>
               </div>
          </div>
         
     )
}