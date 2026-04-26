'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/contexts/authContext'
import { supabase } from '@/app/lib/supabase/client'
import Navbar from '../components/navbar'

export default function ProfilePage() {
  const { user } = useAuth()

  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()

    if (data) {
      setUsername(data.username || '')
      setBio(data.bio || '')
    }
  }

  async function saveProfile() {
    await supabase.from('profiles').upsert({
      id: user?.id,
      username,
      bio,
    })

    alert('Profile updated')
  }

  return (

    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-10">

        <h1 className="text-3xl font-bold mb-5">
          Profile
        </h1>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border border-gray-700 bg-gray-900 p-2 w-full mb-4 text-white rounded"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="border border-gray-700 bg-gray-900 p-2 w-full mb-4 text-white rounded"
        />

        <button
          onClick={saveProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>

      </div>

    </main>

  )
}