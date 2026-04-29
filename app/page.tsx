'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from './lib/supabase/client'

export default function LandingPage() {

  const router = useRouter()

  const [articles, setArticles] = useState<any[]>([])
  const [selectMode, setSelectMode] = useState(false)
  const [selectedArticles, setSelectedArticles] = useState<number[]>([])

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    const { data } = await supabase
  .from("articles")
  .select(`
    *,
    profiles (
      username,
      avatar_url
    )
  `)
  .order("created_at", { ascending: false });

    setArticles(data || [])
  }

  async function deleteArticle(id: number) {
    await supabase.from('articles').delete().eq('id', id)
    fetchArticles()
  }

  function toggleSelect(id: number) {
    if (selectedArticles.includes(id)) {
      setSelectedArticles(selectedArticles.filter(i => i !== id))
    } else {
      setSelectedArticles([...selectedArticles, id])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">

      {/* HERO SECTION */}
      <div className="flex items-center justify-center px-4 py-20">
        <div className="text-center text-white max-w-2xl">

          <h1 className="text-6xl font-bold mb-6">
            Welcome to Student Portal
          </h1>

          <p className="text-xl mb-10 opacity-90">
            Your gateway to learning, collaboration, and success.
            Join our community today.
          </p>

          <Link href="/auth">
            <button className="bg-white text-blue-600 font-semibold py-4 px-10 rounded-full hover:bg-gray-100 hover:scale-105 transition duration-300 shadow-lg">
              Get Started
            </button>
          </Link>

        </div>
      </div>

    </div>
  )
}