'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase/client'
import Navbar from '../components/navbar'

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

  async function deleteArticle(id: number) {

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) {
      console.log(error.message)
      alert(error.message)
      return
    }

    fetchArticles()
  }

  // ✅ FILTER LOGIC ADDED
  const filteredArticles = articles
  .filter((article) => {
    if (selectedTopic === 'All') return true
    return article.topic === selectedTopic
  })
  .filter((article) => {
    return article.title.toLowerCase().includes(search.toLowerCase())
  })
  return (
    <main className="min-h-screen bg-black text-white">

      {/* NAVBAR WITH TOPIC CONTROL */}
      <Navbar
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        search={search}
        setSearch={setSearch}
      />

      <div className="p-10">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            Articles
          </h1>

          <Link href="/articles/create">
            <button className="bg-green-600 px-4 py-2 rounded">
              Create Article
            </button>
          </Link>

        </div>

        {/* FEED CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {filteredArticles.map((article) => (

            <div
              key={article.id}
              className="border border-gray-800 p-5 rounded mb-5 bg-gray-900"
            >

              {/* TITLE */}
              <h2 className="text-2xl font-bold mb-4">
                {article.title}
              </h2>

              {/* CONTENT + IMAGE ROW */}
              <div className="flex gap-6">

                {/* LEFT SIDE - CONTENT */}
                <div className="w-2/3">

                  <p className="text-gray-300 text-sm leading-relaxed">
                    {article.content.length > 180
                      ? article.content.substring(0, 180) + '...'
                      : article.content}
                  </p>

                </div>

                {/* RIGHT SIDE - IMAGE */}
                <div className="w-1/3">

                  {article.image && (
                    <img
                      src={article.image}
                      className="w-full h-32 object-cover rounded"
                    />
                  )}

                </div>

              </div>

              {/* ACTION BAR */}
              <div className="flex justify-between items-center mt-5">

                {/* LEFT - VIEWS */}
                <p className="text-gray-400 text-sm">
                  👁 {article.views || 0} views
                </p>

                {/* CENTER - VIEW BUTTON */}
                <Link href={`/articles/${article.id}`}>
                  <button className="text-blue-400 font-semibold">
                    View
                  </button>
                </Link>

                {/* RIGHT - SHARE */}
                <button
                  onClick={() =>
                    navigator.share
                      ? navigator.share({
                          title: article.title,
                          text: article.content,
                          url: window.location.href,
                        })
                      : alert("Sharing not supported")
                  }
                  className="text-green-400 font-semibold"
                >
                  Share
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  )
}