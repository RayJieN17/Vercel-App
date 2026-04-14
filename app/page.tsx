'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-6xl font-bold mb-6">
          Welcome to Student Portal
        </h1>
        <p className="text-xl mb-10 opacity-90">
          Your gateway to learning, collaboration, and success. Join our community today.
        </p>
        <Link href="/auth">
          <button className="bg-white text-blue-600 font-semibold py-4 px-10 rounded-full hover:bg-gray-100 hover:scale-105 transition duration-300 shadow-lg">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  )
}