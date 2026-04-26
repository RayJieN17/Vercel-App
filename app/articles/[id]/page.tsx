'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase/client'
import { useRef } from 'react'

export default function ArticleDetailsPage() {
  const params = useParams()
  const id = params.id
  const router = useRouter()

  const hasIncremented = useRef(false)

  const [article, setArticle] = useState<any>(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<any[]>([])
  const [imageOpen, setImageOpen] = useState(false)

  useEffect(() => {
    if (!id) return

    fetchArticle()
    fetchComments()

    const articleId = Array.isArray(id) ? id[0] : id

    if (!hasIncremented.current) {
      hasIncremented.current = true
      incrementViews()
    }

  }, [id])

  async function fetchArticle() {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    setArticle(data)
  }

  async function fetchComments() {

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error.message)
      return
    }

    setComments(data || [])
  }

  async function incrementViews() {

    if (!id) return

    const articleId = Array.isArray(id) ? id[0] : id

    const { data, error } = await supabase
      .from('articles')
      .select('views')
      .eq('id', articleId)
      .single()

    if (error) {
      console.log("FETCH ERROR:", error.message)
      return
    }

    const newViews = (data?.views || 0) + 1

    const { error: updateError } = await supabase
      .from('articles')
      .update({ views: newViews })
      .eq('id', articleId)

    if (updateError) {
      console.log("UPDATE ERROR:", updateError.message)
    }
  }

  async function shareArticle() {
    if (!article) return

    await navigator.share({
      title: article.title,
      text: article.content,
      url: window.location.href,
    })
  }

  async function submitComment() {

    if (!comment.trim()) {
      alert('Write a comment first')
      return
    }

    const articleId = Array.isArray(id) ? id[0] : id

    console.log("ARTICLE ID:", articleId)
    console.log("COMMENT:", comment)

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          article_id: Number(articleId),
          content: comment,
          parent_id: null,
        }
      ])

    if (error) {
      console.log("COMMENT ERROR:", error.message)
      alert(error.message)
      return
    }

    console.log("SUCCESS:", data)

    setComment('')

    fetchComments()

    alert('Comment added')
  }

  if (!article) {
    return <div className="p-10 text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <div className="grid grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div>

          <p className="text-gray-400 mb-6">
            👁 Views: {article.views}
          </p>

          <h1 className="text-4xl font-bold mb-6">
            {article.title}
          </h1>

          <p className="whitespace-pre-line text-gray-200 mb-10">
            {article.content}
          </p>

          <div className="flex items-center gap-2 mb-6">

            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment..."
              className="flex-1 p-3 rounded bg-white text-black"
            />

            <button
              onClick={submitComment}
              className="bg-green-600 px-4 py-3 rounded"
            >
              ➤
            </button>

            <button
              onClick={shareArticle}
              className="bg-blue-500 px-4 py-3 rounded"
            >
              🔗
            </button>

          </div>

          {/* COMMENTS SECTION */}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-6">
          Comments
        </h2>

        {comments.length === 0 ? (

          <p className="text-gray-500">
            No comments yet
          </p>

        ) : (

          <div className="space-y-4">

            {comments.map((item) => (

              <div
                key={item.id}
                className="bg-gray-900 p-4 rounded border border-gray-800"
              >

                <p className="text-gray-200">
                  {item.content}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div>

          <div
            className="border border-gray-700 rounded overflow-hidden cursor-pointer"
            onClick={() => setImageOpen(true)}
          >

            <img
              src={article.image || "https://via.placeholder.com/600"}
              className="w-full h-[500px] object-cover"
            />

          </div>

        </div>

      </div>

      {/* IMAGE MODAL */}
      {imageOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setImageOpen(false)}
        >
          <img
            src={article.image}
            className="max-h-[80%] max-w-[80%] object-contain"
          />
        </div>
      )}

    </div>
  )
}