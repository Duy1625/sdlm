'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

interface Comment {
  id: number
  content: string
  createdAt: string
  userId: number | null
  guestName: string | null
  user: {
    id: number
    name: string | null
    avatar: string | null
  } | null
}

interface CommentSectionProps {
  listingId: number
}

export default function CommentSection({ listingId }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load comments
  const loadComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?listingId=${listingId}`)
      const data = await response.json()

      if (data.success) {
        setComments(data.comments)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Lỗi khi tải comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [listingId])

  const handleCommentAdded = (newComment: Comment) => {
    setComments([newComment, ...comments])
  }

  const handleCommentDeleted = (commentId: number) => {
    setComments(comments.filter(c => c.id !== commentId))
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          💬 Bình luận ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <CommentForm
        listingId={listingId}
        onCommentAdded={handleCommentAdded}
      />

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Đang tải comments...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      ) : (
        <CommentList
          comments={comments}
          currentUserId={session?.user?.id ? parseInt(session.user.id) : null}
          isAdmin={session?.user?.role === 'ADMIN'}
          onCommentDeleted={handleCommentDeleted}
        />
      )}
    </div>
  )
}
