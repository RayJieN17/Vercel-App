"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

export default function CommentSection({
  articleId,
}: {
  articleId: number;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });

    setComments(data || []);
  }

  async function addComment(parentId : number | null = null) {
    const { data: userData } =
      await supabase.auth.getUser();

    const email = userData?.user?.email;

    if (!email || !text.trim()) return;

    await supabase.from("comments").insert({
      article_id: articleId,
      user_email: email,
      content: text,
      parent_id: null,
    });

    setText("");
    setReplyingTo(null);

    fetchComments();
  }

  const rootComments = comments.filter(
    (c) => c.parent_id === null
  );

  function getReplies(parentId: number) {
    return comments.filter(
      (c) => c.parent_id === parentId
    );
  }

  return (
    <div className="border-t border-[#2f3136] p-4">
      {/* COMMENT INPUT */}

      <div className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            replyingTo
              ? "Write a reply..."
              : "Write a comment..."
          }
          className="flex-1 bg-[#2a2d31] text-white px-4 py-2 rounded-full outline-none"
        />

        <button
          onClick={() => addComment(replyingTo)}
          className="bg-blue-600 hover:bg-blue-700 px-5 rounded-full"
        >
          Post
        </button>
      </div>

      {/* COMMENTS */}

      <div className="space-y-4">
        {rootComments.map((comment) => (
          <div key={comment.id}>
            <div className="bg-[#2a2d31] p-3 rounded-2xl">
              <p className="text-xs text-gray-400">
                {comment.user_email}
              </p>

              <p className="text-white text-sm mt-1">
                {comment.content}
              </p>

              <button
                onClick={() =>
                  setReplyingTo(comment.id)
                }
                className="text-xs text-blue-400 mt-2"
              >
                Reply
              </button>
            </div>

            {/* REPLIES */}

            <div className="ml-10 mt-2 space-y-2">
              {getReplies(comment.id).map((reply) => (
                <div
                  key={reply.id}
                  className="bg-[#3a3d42] p-3 rounded-2xl"
                >
                  <p className="text-xs text-gray-400">
                    {reply.user_email}
                  </p>

                  <p className="text-white text-sm mt-1">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}