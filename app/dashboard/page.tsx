'use client'

import Navbar from '../components/navbar'
import TopArticles from '../components/TopArticles'

export default function DashboardPage() {

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-10">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="mb-10">
          <TopArticles />
        </div>

      </div>

    </main>
  )
}