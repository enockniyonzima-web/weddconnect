"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlogComment, fetchBlogComments } from "@/server-actions/blog/blog-comment";
import { SPubBlogComment, TPubBlogComment } from "@/select-types/blog/blog-comment";
import { useAuthContext } from "@/components/context/AuthContext";
import { Loader2, MessageCircle, Reply, Send, User } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

function CommentAvatar({ image, name }: { image?: string | null; name?: string | null }) {
  if (image) {
    return (
      <div className="relative size-8 rounded-full overflow-hidden shrink-0 border border-gray-800">
        <Image src={image} alt={name ?? "User"} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="size-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
      <User size={14} className="text-gray-500" />
    </div>
  );
}

function CommentForm({
  postId,
  parentId,
  onSuccess,
  placeholder = "Write a comment…",
}: {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
}) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createBlogComment({
        content: text.trim(),
        post: { connect: { id: postId } },
        ...(user?.id ? { commenter: { connect: { id: user.id } } } : {}),
        ...(parentId ? { parentComment: { connect: { id: parentId } } } : {}),
      }),
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["pub-comments", postId] });
      onSuccess?.();
    },
  });

  const canSubmit = text.trim().length >= 2 && !isPending;

  return (
    <div className="flex gap-2.5">
      <CommentAvatar image={user?.image} name={user?.admin?.name ?? user?.client?.name} />
      <div className="flex-1 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && canSubmit && mutate()}
          placeholder={user ? placeholder : "Sign in to leave a comment"}
          disabled={!user}
          className="flex-1 bg-gray-900 border border-gray-800 rounded-full px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600/50 disabled:opacity-50 transition-colors"
        />
        {user && (
          <button
            onClick={() => mutate()}
            disabled={!canSubmit}
            className="flex items-center gap-1 text-sm px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors shrink-0"
          >
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment, postId }: { comment: TPubBlogComment; postId: string }) {
  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const replyCount = comment.replies?.length ?? 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2.5">
        <CommentAvatar image={comment.commenter?.image} name={comment.commenter?.email.split("@")[0]} />
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-sm font-semibold text-white">{comment.commenter?.email.split("@")[0] ?? "Anonymous"}</span>
            <span className="text-xs text-gray-600">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
          <button
            onClick={() => setReplying((v) => !v)}
            className="flex items-center gap-1 mt-1 text-xs text-gray-600 hover:text-blue-400 transition-colors"
          >
            <Reply size={11} /> Reply
          </button>
        </div>
      </div>

      {replying && (
        <div className="ml-10">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            placeholder={`Reply to ${comment.commenter?.email.split("@")[0] ?? "comment"}…`}
            onSuccess={() => {
              setReplying(false);
              setShowReplies(true);
            }}
          />
        </div>
      )}

      {replyCount > 0 && (
        <div className="ml-10">
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors mb-1.5"
          >
            {showReplies ? "Hide" : "Show"} {replyCount} repl{replyCount === 1 ? "y" : "ies"}
          </button>
          {showReplies && (
            <div className="flex flex-col gap-2.5">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2.5">
                  <CommentAvatar image={reply.commenter?.image} name={reply.commenter?.email.split("@")[0]} />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white">{reply.commenter?.email.split("@")[0] ?? "Anonymous"}</span>
                      <span className="text-xs text-gray-600">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function BlogCommentsSection({ postId }: { postId: string }) {
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["pub-comments", postId],
    queryFn: () =>
      fetchBlogComments(SPubBlogComment, { postId, parentCommentId: null }, 50, 0),
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MessageCircle size={18} className="text-blue-500" />
        <h2 className="text-lg font-bold text-white">
          Comments {!isLoading && <span className="text-gray-600 text-base font-normal">({comments.length})</span>}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={20} className="animate-spin text-blue-500" />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-6 text-sm text-gray-600">No comments yet. Be the first!</div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-800/50">
          {comments.map((c) => (
            <div key={c.id} className="py-3">
              <CommentItem comment={c} postId={postId} />
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-gray-800">
        <CommentForm postId={postId} />
      </div>
    </section>
  );
}
