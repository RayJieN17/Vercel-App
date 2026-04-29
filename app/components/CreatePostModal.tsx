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
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email;

    if (!email || !content.trim()) {
      setLoading(false);
      return;
    }

    let imageUrl = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { data } = await supabase.storage
        .from("posts")
        .upload(fileName, image);

      if (data) {
        const { data: publicUrl } = supabase.storage
          .from("posts")
          .getPublicUrl(fileName);

        imageUrl = publicUrl.publicUrl;
      }
    }

    await supabase.from("articles").insert({
      content,
      image_url: imageUrl,
      user_email: email,
    });

    setContent("");
    setImage(null);
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

        {/* TEXT AREA */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-[#2a2d31] text-white p-3 rounded-xl outline-none h-32"
        />

        {/* IMAGE INPUT */}
        <input
          type="file"
          onChange={(e) =>
            setImage(e.target.files?.[0] || null)
          }
          className="mt-3 text-white"
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