"use client";

import { BlogPostForm } from "@/components/forms/blog/BlogPostForm";
import { useSearchParams } from "next/navigation";

export default function AdminBlogFormPage () {
     const searchParams = useSearchParams();
     const postId = searchParams.get("id");
     return (
          <div className="w-full p-4">
               <BlogPostForm postId={postId ?? undefined} />
          </div>
     )
}