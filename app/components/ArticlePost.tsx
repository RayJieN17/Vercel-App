"use client"

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import CommentSection from "./CommentSection";

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

export default function ArticlePost({ article }: { article: Article }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(
    article.comment_count || 0
  );
  const [shareCount, setShareCount] = useState(
    article.share_count || 0
  );

  const displayName = article.username || article.user_email;

  useEffect(() => {
    loadLikes();
  }, []);

  async function loadLikes() {
    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData?.user?.email;

    if (userEmail) {
      const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

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

      setLikeCount((prev) => prev - 1);
    } else {
      await supabase.from("article_likes").insert({
        article_id: article.id,
        user_email: userEmail,
      });

      setLiked(true);

      setLikeCount((prev) => prev + 1);
    }
  }

  async function handleShare() {
    try {
      await navigator.share({
        title: "Article",
        text: article.content,
        url: window.location.href,
      });

      setShareCount((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
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

      {/* IMAGE */}
      {article.image_url && (
        <div className="w-full bg-black">
          <img
            src={article.image_url}
            alt="post image"
            className="w-full max-h-[600px] object-cover cursor-pointer hover:opacity-95 transition"
            onClick={() => window.open(article.image_url, "_blank")}
          />
        </div>
      )}

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

        <button className="flex items-center justify-center gap-2 py-3 hover:bg-[#2a2d31] transition">
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
      <CommentSection articleId={article.id} />
    </div>
  );
}