'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase/client'

export default function TopArticles() {
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    fetchTopArticles()
  }, [])

  async function fetchTopArticles() {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('views', { ascending: false })
      .limit(5)

    setArticles(data || [])
  }

  return (
    <div className="border p-5 rounded">
      <h2 className="text-2xl font-bold mb-4">
        Top 5 Articles
      </h2>

      {articles.map((article, index) => (
        <Link
          href={`/articles/${article.id}`}
          key={article.id}
        >
          <div className="mb-4 border-b pb-2 cursor-pointer">
            <p className="font-bold">
              #{index + 1} {article.title}
            </p>

            <p className="text-sm text-gray-500">
              {article.views} views
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}