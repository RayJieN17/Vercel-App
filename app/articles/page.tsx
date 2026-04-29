'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase/client'
import Navbar from '../components/navbar'
import ArticlePost from '../components/ArticlePost'
import CreatePostModal from "../components/CreatePostModal";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [search, setSearch] = useState('')

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
            <ArticlePost
              key={article.id}
              article={article}
            />
          ))}
        </div>
      </div>

      <CreatePostModal
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        onPostCreated={fetchArticles}
      />
    </main>
  )
}