"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";
import Navbar from "../components/navbar";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: userData } =
      await supabase.auth.getUser();

    const user = userData?.user;

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
    setUsername(data?.username || "");
    setBio(data?.bio || "");
    setAvatar(data?.avatar_url || "");
  }

  async function uploadAvatar(e: any) {
    const file = e.target.files[0];

    if (!file) return;

    const filePath = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (error) return;

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    setAvatar(data.publicUrl);
  }

  async function saveProfile() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        username,
        bio,
        avatar_url: avatar,
        updated_at: new Date(),
      });

    if (!error) {
      alert("Profile saved!");
    } else {
      console.log(error);
    }
  }

  return (
    <main className="min-h-screen bg-[#18191a] text-white">
      {/* SAME NAVBAR AS ARTICLES */}
      <Navbar />

      {/* PAGE CONTENT */}
      <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>

      <div className="max-w-3xl mx-auto px-4 -mt-16">
        {/* PROFILE CARD */}
        <div className="bg-[#242526] p-6 rounded-2xl shadow-lg">
          
          {/* AVATAR */}
          <div className="flex items-end gap-4">
            <div className="relative">
              <img
                src={
                  avatar ||
                  "https://ui-avatars.com/api/?name=User"
                }
                className="w-24 h-24 rounded-full border-4 border-[#18191a]"
              />

              <input
                type="file"
                onChange={uploadAvatar}
                className="absolute bottom-0 left-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {username || "Username"}
              </h2>
              <p className="text-gray-400 text-sm">
                {profile?.email}
              </p>
            </div>
          </div>

          {/* EDIT FIELDS */}
          <div className="mt-6 space-y-3">
            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Username"
              className="w-full bg-[#3a3b3c] px-4 py-2 rounded-lg outline-none"
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio..."
              className="w-full bg-[#3a3b3c] px-4 py-2 rounded-lg outline-none"
            />

            <button
              onClick={saveProfile}
              className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}