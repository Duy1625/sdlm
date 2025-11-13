'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function HeaderSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Bạn muốn mua gì?"
          className="w-full px-4 py-2 pr-24 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-primary text-white font-semibold rounded-md hover:shadow-lg transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  )
}
