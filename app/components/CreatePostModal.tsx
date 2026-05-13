"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase/client";
import { X } from "lucide-react";

export default function CreatePostModal({
  open,
  onClose,
  onPostCreated,
}: {
  open: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit() {
    setLoading(true);
    setErrorMsg(null);

    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email;

    if (!email || !content.trim()) {
      setErrorMsg("Missing email or content");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from("articles").insert({
      content,
      user_email: email,
    });

    console.log("INSERT RESULT:", { data, error });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setContent("");
    setLoading(false);

    onPostCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1c1e21] w-full max-w-lg rounded-2xl p-4 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400"
        >
          <X />
        </button>

        {/* TITLE */}
        <h2 className="text-white text-lg font-bold mb-4">
          Create Post
        </h2>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="mb-3 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        {/* TEXT AREA */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-[#2a2d31] text-white p-3 rounded-xl outline-none h-32"
        />

        {/* ACTIONS */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-2 rounded-xl font-medium"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}