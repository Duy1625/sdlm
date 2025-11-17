'use client'

import { useState } from 'react'

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

interface CommentListProps {
  comments: Comment[]
  currentUserId: number | null
  isAdmin: boolean
  onCommentDeleted: (commentId: number) => void
}

export default function CommentList({
  comments,
  currentUserId,
  isAdmin,
  onCommentDeleted,
}: CommentListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (commentId: number) => {
    if (!confirm('Bạn có chắc muốn xóa comment này?')) return

    try {
      setDeletingId(commentId)

      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        onCommentDeleted(commentId)
      } else {
        alert(data.error || 'Lỗi khi xóa comment')
      }
    } catch (err) {
      alert('Lỗi khi xóa comment')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-lg font-medium">Chưa có bình luận nào</p>
        <p className="text-sm mt-1">Hãy là người đầu tiên bình luận!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const canDelete = isAdmin || (currentUserId && comment.userId === currentUserId)
        const userName = comment.user?.name || comment.guestName || 'Người dùng ẩn danh'
        const userInitial = userName.charAt(0).toUpperCase()

        return (
          <div
            key={comment.id}
            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {comment.user?.avatar ? (
                  <img
                    src={comment.user.avatar}
                    alt={userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {userInitial}
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{userName}</span>
                  {!comment.userId && (
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                      Khách
                    </span>
                  )}
                  {isAdmin && comment.userId && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Thành viên
                    </span>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      {deletingId === comment.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
