'use client'

import { useRef, useState } from 'react'
import { supabase } from '@/app/lib/supabase/client'
import { useAuth } from '@/app/contexts/authContext'
import Navbar from '../../components/navbar'

export default function CreateArticlePage() {

  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [topic, setTopic] = useState('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleImageClick() {
    fileInputRef.current?.click()
  }

  async function createArticle() {

    let imageUrl = null

    // 1. Upload image to Supabase Storage
    if (image) {

      const fileName = `${Date.now()}-${image.name.replace(/\s/g, '-')}`

      const { error } = await supabase.storage
        .from('articles')
        .upload(fileName, image)

      if (error) {
        console.log('UPLOAD ERROR:', error.message)
        alert(error.message)
        return
      }

      const { data: urlData } = supabase.storage
        .from('articles')
        .getPublicUrl(fileName)

      imageUrl = urlData.publicUrl
    }

    // 2. Save article to database (NOW INCLUDES TOPIC)
    const { error: insertError } = await supabase.from('articles').insert({
      user_id: user?.id,
      title,
      content,
      image: imageUrl,
      topic: topic,
    })

    if (insertError) {
      console.log('INSERT ERROR:', insertError.message)
      alert(insertError.message)
      return
    }

    alert('Article created successfully!')

    setTitle('')
    setContent('')
    setImage(null)
    setTopic('') // reset topic
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="max-w-6xl mx-auto p-10">

        <h1 className="text-4xl font-bold mb-10">
          Create Article
        </h1>

        <div className="grid grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          <div className="bg-gray-900 border border-gray-700 rounded p-6">

            <div className="mb-6">

              <label className="block mb-2 text-gray-300 text-lg">
                Article Title
              </label>

              <input
                type="text"
                placeholder="Enter article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded bg-white text-black"
              />

            </div>

            <div className="mb-6">

              <label className="block mb-2 text-gray-300 text-lg">
                Article Content
              </label>

              <textarea
                placeholder="Write your article here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[350px] p-3 rounded bg-white text-black"
              />

            </div>

            {/* ✅ FIXED: Topic moved inside LEFT SIDE */}
            <div>

              <label className="block mb-2 text-gray-300 text-lg">
                Topic
              </label>

              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 rounded bg-white text-black"
              >
                <option value="">Select Topic</option>
                <option value="Tech">Tech</option>
                <option value="Education">Education</option>
                <option value="Science">Science</option>
                <option value="Sports">Sports</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="bg-gray-900 border border-gray-700 rounded p-6 flex flex-col justify-between">

            <div>

              <h2 className="text-xl font-bold mb-4">
                Article Image
              </h2>

              <div
                onClick={handleImageClick}
                className="border-2 border-dashed border-gray-600 h-[420px] rounded flex items-center justify-center cursor-pointer overflow-hidden"
              >

                {image ? (

                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <p className="text-gray-500">
                    Click to upload image
                  </p>

                )}

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0])
                  }
                }}
              />

            </div>

            <button
              onClick={createArticle}
              className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold mt-6"
            >
              Publish Article
            </button>

          </div>

        </div>

      </div>

    </main>
  )
}