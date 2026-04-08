import Link from "next/link";

export default function AdminNotFound() {
     return (
          <div className='w-screen h-screen flex items-center justify-center gap-[10px] bg-gray-950'>
               <h1 className='text-4xl text-white font-bold'>404 | Page not found</h1>
               <Link href='/dashboard/admin' prefetch={true} className="text-blue-400 text-[0.9rem]">Back to main page</Link>
          </div>
     )
}