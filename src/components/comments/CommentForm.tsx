'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface CommentFormProps {
  listingId: number
  onCommentAdded: (comment: any) => void
}

export default function CommentForm({ listingId, onCommentAdded }: CommentFormProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!content.trim()) {
      setError('Vui lòng nhập nội dung comment')
      return
    }

    if (!session && !guestName.trim()) {
      setError('Vui lòng nhập tên của bạn')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          content: content.trim(),
          guestName: !session ? guestName.trim() : undefined,
          guestEmail: !session ? guestEmail.trim() : undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setContent('')
        setGuestName('')
        setGuestEmail('')
        onCommentAdded(data.comment)
      } else {
        setError(data.error || 'Lỗi khi đăng comment')
      }
    } catch (err) {
      setError('Lỗi khi đăng comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Guest Info (only if not logged in) */}
      {!session && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Tên của bạn *"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Email (không bắt buộc)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Comment Textarea */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={session ? "Viết bình luận của bạn..." : "Viết bình luận... (cần nhập tên)"}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 resize-none"
          disabled={submitting}
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        {!session && (
          <p className="text-sm text-gray-600">
            Hoặc <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">đăng nhập</Link> để comment
          </p>
        )}
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="ml-auto px-6 py-2 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </div>
    </form>
  )
}
