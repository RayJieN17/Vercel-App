'use client'

import Link from 'next/link'
import { useAuth } from '../contexts/authContext'
import { Home } from 'lucide-react'
import NotificationBell from "./NotificationBell";
import { usePathname } from "next/navigation";

export default function Navbar({ selectedTopic, setSelectedTopic, search,
  setSearch }: any) {

  const { signOut } = useAuth()

  const pathname = usePathname();

  const isProfilePage = pathname?.includes("/profile");

  return (
    <div className="border-b border-gray-800 p-4">

      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold">
          Student Portal
        </h1>

        <div className="flex items-center gap-4">

          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 px-4 py-2 rounded w-[500px]"
          />

          <NotificationBell />

          <button
            onClick={signOut}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Sign Out
          </button>

        </div>

      </div>

      {/* SECOND ROW */}
      <div className="flex gap-6 mt-4 items-center">

        {/* HOME BUTTON ADDED */}
        <Link href="/dashboard">
          <button className="text-white hover:text-gray-300">
            <Home size={22} />
          </button>
        </Link>

        <Link href="/articles">
          Articles
        </Link>

        <Link href="/profile">
          Profile
        </Link>

        <select
          className="bg-black text-white px-3 py-2 rounded border border-gray-700 focus:outline-none"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="All">All Topics</option>
          <option value="Tech">Tech</option>
          <option value="Education">Education</option>
          <option value="Science">Science</option>
          <option value="Sports">Sports</option>
          <option value="Lifestyle">Lifestyle</option>
        </select>

      </div>

    </div>
  )
}