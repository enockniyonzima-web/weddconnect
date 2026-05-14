import { TPost } from '@/common/Entities'
import PostCard from './PostCard'
import { cn } from '@/lib/utils'

const PostSkeleton = () => (
     <div className="w-full flex flex-col rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden animate-pulse">
          <div className="w-full max-w-7xl mx-auto"></div>
          <div className="w-full aspect-[4/3] bg-gray-900" />
          <div className="p-4 flex flex-col gap-3">
               <div className="h-4 bg-gray-800 rounded w-3/4" />
               <div className="h-3 bg-gray-800 rounded w-1/3" />
               <div className="grid grid-cols-3 gap-2 mt-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                         <div key={i} className="h-6 bg-gray-800 rounded-lg" />
                    ))}
               </div>
          </div>
     </div>
)

const PostsContainer = ({ posts, isLoading }: { posts: TPost[], isLoading?: boolean }) => {
     if (isLoading) {
          return (
               <div className={cn('w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5')}>
                    {Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)}
               </div>
          )
     }
     if (posts.length === 0) {
          return (
               <div className='w-full flex flex-col items-center justify-center py-20 gap-3'>
                    <p className='text-3xl'>🔍</p>
                    <p className='text-white font-semibold'>No listings found</p>
                    <p className='text-sm text-gray-500'>Try adjusting your filters or search terms</p>
               </div>
          )
     }
     return (
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
               {posts.map((post: TPost, index: number) => (
                    <PostCard post={post} key={`posts-page-post-${index}`} />
               ))}
          </div>
     )
}

export default PostsContainer
