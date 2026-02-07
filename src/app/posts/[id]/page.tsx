import { SPostPage} from "@/common/Entities";
import { PostImagesView } from "../[components]/PostImagesView";
import { formatPrice } from "@/util/stringFuncs";
import { VendorContactCard } from "../[components]/VendorContactCard";
import { LGPostFeatureCard } from "@/components/cards/PostFeatureCard";
import { PostReviewContainer } from "@/components/containers/PostReviewContainer";
import { MapPin, Tag, Heart, MessageSquare } from "lucide-react";
import { fetchPostById } from "@/server-actions/post.actions";

export default async function PostPage ({params}: {params: Promise<{id: string}>}) {
     const id = (await params).id;
     const post = await fetchPostById(Number(id),SPostPage )
     if(!post) {
          return (
               <div className="w-full min-h-screen bg-black flex items-center justify-center py-20">
                    <div className="text-center">
                         <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center">
                              <MessageSquare className="w-10 h-10 text-gray-600" />
                         </div>
                         <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
                         <p className="text-gray-400">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    </div>
               </div>
          );
     }
     
     return (
          <div className="w-full min-h-screen bg-black py-12">
               <div className="w-full py-6 md:py-12 px-4 md:px-8 lg:px-16 max-w-[1600px] mx-auto">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-6 space-y-4">
                         <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{post.title}</h1>
                         
                         {/* Meta Info */}
                         <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                   <Tag className="w-4 h-4" />
                                   <span>{post.category.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                   <MapPin className="w-4 h-4" />
                                   <span>{post.location}</span>
                              </div>
                         </div>

                         {/* Engagement Stats */}
                         <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1.5 text-gray-400">
                                   <Heart className="w-4 h-4" />
                                   <span>{post._count.likes} likes</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-400">
                                   <MessageSquare className="w-4 h-4" />
                                   <span>{post._count.reviews} reviews</span>
                              </div>
                         </div>

                         {/* Price */}
                         {post.price ? (
                              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4">
                                   <p className="text-blue-100 text-sm mb-1">Price Range</p>
                                   <p className="text-white text-xl font-bold">
                                        {post.price.currency} {formatPrice(post.price.min)} - {formatPrice(post.price.max)}
                                   </p>
                              </div>
                         ) : (
                              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 border border-gray-600">
                                   <p className="text-gray-300 text-lg font-semibold">Price: Negotiable</p>
                              </div>
                         )}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                         {/* Left Column - Images */}
                         <div className="w-full">
                              <PostImagesView images={post.images} />
                         </div>

                         {/* Right Column - Details */}
                         <div className="w-full space-y-6">
                              {/* Desktop Header */}
                              <div className="hidden lg:block space-y-4">
                                   <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">{post.title}</h1>
                                   
                                   {/* Meta Info */}
                                   <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2 text-gray-400">
                                             <Tag className="w-5 h-5" />
                                             <span>{post.category.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                             <MapPin className="w-5 h-5" />
                                             <span>{post.location}</span>
                                        </div>
                                   </div>

                                   {/* Engagement Stats */}
                                   <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 text-gray-400">
                                             <Heart className="w-5 h-5" />
                                             <span>{post._count.likes} likes</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                             <MessageSquare className="w-5 h-5" />
                                             <span>{post._count.reviews} reviews</span>
                                        </div>
                                   </div>

                                   {/* Price */}
                                   {post.price ? (
                                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6">
                                             <p className="text-blue-100 text-sm mb-2">Price Range</p>
                                             <p className="text-white text-2xl font-bold">
                                                  {post.price.currency} {formatPrice(post.price.min)} - {formatPrice(post.price.max)}
                                             </p>
                                        </div>
                                   ) : (
                                        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-600">
                                             <p className="text-gray-300 text-xl font-semibold">Price: Negotiable</p>
                                        </div>
                                   )}
                              </div>

                              {/* Features Section */}
                              {post.features.length > 0 && (
                                   <div className="bg-gray-900 rounded-xl p-5 md:p-6 border border-gray-800">
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                             <div className="w-1 h-6 bg-blue-600 rounded"></div>
                                             Key Features
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             {post.features.map((feature, index) => (
                                                  <LGPostFeatureCard feature={feature} key={`feature-${index}`} />
                                             ))}
                                        </div>
                                   </div>
                              )}

                              {/* Description Section */}
                              <div className="bg-gray-900 rounded-xl p-5 md:p-6 border border-gray-800">
                                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-blue-600 rounded"></div>
                                        Description
                                   </h3>
                                   <p className="text-gray-300 leading-relaxed">{post.description}</p>
                              </div>

                              {/* Vendor Contact Section */}
                              {post.vendor.contacts.length > 0 && (
                                   <div className="bg-gradient-to-br from-blue-900 to-gray-900 rounded-xl p-5 md:p-6 border border-blue-800">
                                        <h3 className="text-xl font-bold text-white mb-4">Contact Vendor</h3>
                                        <p className="text-blue-200 text-sm mb-4">Get in touch with {post.vendor.name}</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                             {post.vendor.contacts.map(c => (
                                                  <VendorContactCard key={`vendor-contact-${c.id}`} contact={c} />
                                             ))}
                                        </div>
                                   </div>
                              )}
                         </div>
                    </div>

                    {/* Reviews Section - Full Width */}
                    <div className="mt-12">
                         <PostReviewContainer postId={post.id} />
                    </div>
               </div>
          </div>
     );
}