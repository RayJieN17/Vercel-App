"use client"

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import CommentSection from "./CommentSection";

let cachedUserEmail: string | null = null;

type Article = {
  id: any;
  content: string;
  image_url?: string;
  created_at: string;
  user_email: string;
  username?: string;
  comment_count?: number;
  share_count?: number;
};

export default function ArticlePost({
  article,
  setFocusedPost,
}: {
  article: Article;
  setFocusedPost?: (a: Article) => void;
}) {

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(
    article.comment_count || 0
  );
  const [shareCount, setShareCount] = useState(
    article.share_count || 0
  );

  const [openShare, setOpenShare] = useState(false);

  const displayName = article.username || article.user_email;

  useEffect(() => {
    loadLikes();
  }, []);

  async function loadLikes() {
    let userEmail = cachedUserEmail;

    if (!userEmail) {
      const { data } = await supabase.auth.getUser();
      userEmail = data?.user?.email || null;
      cachedUserEmail = userEmail;
    }

    if (userEmail) {
      const { data } = await supabase
        .from("article_likes")
        .select("*")
        .eq("article_id", article.id)
        .eq("user_email", userEmail)
        .single();

      setLiked(!!data);
    }

    const { count } = await supabase
      .from("article_likes")
      .select("*", { count: "exact", head: true })
      .eq("article_id", article.id);

    setLikeCount(count || 0);

    const { count: comments } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("article_id", article.id);

    setCommentCount(comments || 0);
  }

  async function handleLike() {
    const { data } = await supabase.auth.getUser();
    const userEmail = data?.user?.email;

    if (!userEmail) return;

    if (liked) {
      await supabase
        .from("article_likes")
        .delete()
        .eq("article_id", article.id)
        .eq("user_email", userEmail);

      setLiked(false);
      setLikeCount((prev) => Math.max(prev - 1, 0));
    } else {
      const { error } = await supabase
        .from("article_likes")
        .insert({
          article_id: article.id,
          user_email: userEmail,
        });

      if (error) {
        console.log("Already liked:", error.message);
        return;
      }

      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  }

  function handleShare() {
    setOpenShare(true);
  }

  return (
    <div className="bg-[#1c1e21] border border-[#2f3136] rounded-2xl shadow-lg overflow-hidden mb-6 w-full max-w-2xl">

      {/* HEADER */}
      <div className="flex items-center gap-3 p-4">
        <img
          src="https://ui-avatars.com/api/?name=User"
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <h2 className="font-semibold text-white text-sm">
            {displayName}
          </h2>

          <p className="text-gray-400 text-xs">
            {new Date(article.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 pb-3 text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
        {article.content}
      </div>

      {/* COUNTS */}
      <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-400 border-b border-[#2f3136]">
        <span>{likeCount} likes</span>

        <div className="flex gap-4">
          <span>{commentCount} comments</span>
          <span>{shareCount} shares</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-3 text-sm text-gray-300">

        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-2 py-3 hover:bg-[#2a2d31] transition ${
            liked ? "text-blue-400" : ""
          }`}
        >
          <Heart size={18} />
          Like
        </button>

        <button
          onClick={() => setFocusedPost?.(article)}
          className="flex items-center justify-center gap-2 py-3 hover:bg-[#2a2d31] transition"
        >
          <MessageCircle size={18} />
          Comment
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 hover:bg-[#2a2d31] transition"
        >
          <Share2 size={18} />
          Share
        </button>

      </div>

      {/* SHARE MODAL (NEW SIMPLE VERSION) */}
      {openShare && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setOpenShare(false)}
        >
          <div
            className="bg-[#1c1e21] w-full max-w-sm rounded-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-lg font-semibold mb-2">
              Share Post
            </h2>

            {/* COPY LINK */}
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied!");
                setOpenShare(false);
              }}
              className="w-full bg-[#2a2d31] hover:bg-[#3a3d42] text-white py-2 rounded-lg"
            >
              📋 Copy Link
            </button>

            {/* FACEBOOK / MESSENGER */}
            <button
              onClick={() => {
                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`;

                window.open(url, "_blank");
                setOpenShare(false);
              }}
              className="w-full bg-[#2a2d31] hover:bg-[#3a3d42] text-white py-2 rounded-lg"
            >
              💬 Share on Facebook
            </button>

            {/* EMAIL */}
            <button
              onClick={() => {
                const subject = "Check this post";
                const body = `${article.content}\n\n${window.location.href}`;

                window.location.href = `mailto:?subject=${encodeURIComponent(
                  subject
                )}&body=${encodeURIComponent(body)}`;

                setOpenShare(false);
              }}
              className="w-full bg-[#2a2d31] hover:bg-[#3a3d42] text-white py-2 rounded-lg"
            >
              📧 Email
            </button>

            {/* NATIVE SHARE */}
            {navigator.share && (
              <button
                onClick={async () => {
                  await navigator.share({
                    title: "Community Post",
                    text: article.content,
                    url: window.location.href,
                  });

                  setOpenShare(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                📱 More Options
              </button>
            )}

            {/* CANCEL */}
            <button
              onClick={() => setOpenShare(false)}
              className="w-full text-gray-400 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}