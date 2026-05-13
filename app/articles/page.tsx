'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase/client'
import Navbar from '../components/navbar'
import ArticlePost from '../components/ArticlePost'
import CreatePostModal from "../components/CreatePostModal";
import CommentSection from "../components/CommentSection";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [search, setSearch] = useState('')

  const [focusedPost, setFocusedPost] = useState<any | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    setArticles(data || [])
  }

  const filteredArticles = articles
    .filter((article) => {
      if (selectedTopic === 'All') return true
      return article.topic === selectedTopic
    })
    .filter((article) => {
      return article.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    })

  const [openCreatePost, setOpenCreatePost] = useState(false);

  return (
    <main className="min-h-screen bg-[#18191a] text-white">
      <Navbar
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        search={search}
        setSearch={setSearch}
      />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Community Feed
          </h1>

          <button
            onClick={() => setOpenCreatePost(true)}
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-full font-medium"
          >
            Create Post
          </button>
        </div>

        <div>
          {filteredArticles.map((article: any) => (
            <div key={article.id}>
              
              {/* 🔥 STEP 3 FIX: SHARE INDICATOR */}
              {article.shared_from && (
                <div className="text-blue-400 text-xs mb-1 px-2">
                  🔁 Shared Post
                </div>
              )}

              {/* 🔥 STEP 3 FIX: SHARE MESSAGE */}
              {article.share_message && (
                <div className="text-gray-400 text-sm italic mb-2 px-2">
                  "{article.share_message}"
                </div>
              )}

              <ArticlePost
                article={article}
                setFocusedPost={setFocusedPost}
              />
            </div>
          ))}
        </div>
      </div>

      <CreatePostModal
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        onPostCreated={fetchArticles}
      />

      {/* FACEBOOK STYLE FOCUS MODE */}
      {focusedPost && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setFocusedPost(null)}
        >
          <div
            className="w-full max-w-xl max-h-[85vh] bg-[#1c1e21] rounded-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-3">
              <button
                onClick={() => setFocusedPost(null)}
                className="text-white text-lg"
              >
                ✕
              </button>
            </div>

            <ArticlePost article={focusedPost} />

            <div className="overflow-y-auto flex-1">
              <CommentSection articleId={focusedPost.id} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}