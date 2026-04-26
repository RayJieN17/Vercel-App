'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase/client'
import { useAuth } from '@/app/contexts/authContext'

export default function CommentSection({
  articleId,
}: {
  articleId: number
}) {
  const { user } = useAuth()

  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<any[]>([])
  const [replyText, setReplyText] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  useEffect(() => {
    fetchComments()
  }, [])

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true })

    setComments(data || [])
  }

  async function addComment() {
    if (!comment.trim()) return

    await supabase.from('comments').insert({
      article_id: articleId,
      user_id: user?.id,
      content: comment,
      parent_id: null,
    })

    const { data: article } = await supabase
      .from('articles')
      .select('user_id')
      .eq('id', articleId)
      .single()

    if (article?.user_id) {
      await supabase.from('notifications').insert({
        user_id: article.user_id,
        message: 'Someone commented on your article',
      })
    }

    setComment('')
    fetchComments()
  }

  async function addReply(parentId: number) {
    if (!replyText.trim()) return

    await supabase.from('comments').insert({
      article_id: articleId,
      user_id: user?.id,
      content: replyText,
      parent_id: parentId,
    })

    setReplyText('')
    setReplyingTo(null)

    fetchComments()
  }

  const mainComments = comments.filter(
    (comment) => comment.parent_id === null
  )

  const getReplies = (commentId: number) => {
    return comments.filter(
      (comment) => comment.parent_id === commentId
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Comments
      </h2>

      <div className="mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment"
          className="border w-full p-3 text-black"
        />

        <button
          onClick={addComment}
          className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
        >
          Comment
        </button>
      </div>

      {mainComments.map((item) => (
        <div
          key={item.id}
          className="border p-4 mb-4 rounded"
        >
          <p>{item.content}</p>

          <button
            onClick={() => setReplyingTo(item.id)}
            className="text-blue-500 mt-2"
          >
            Reply
          </button>

          {replyingTo === item.id && (
            <div className="mt-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write reply"
                className="border w-full p-2 text-black"
              />

              <button
                onClick={() => addReply(item.id)}
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
              >
                Submit Reply
              </button>
            </div>
          )}

          <div className="ml-8 mt-4">
            {getReplies(item.id).map((reply) => (
              <div
                key={reply.id}
                className="border-l-4 pl-4 mb-3"
              >
                <p>{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}