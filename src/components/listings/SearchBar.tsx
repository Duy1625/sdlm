'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
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
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm, dịch vụ..."
          className="w-full px-6 py-4 pr-32 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors shadow-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  )
}
