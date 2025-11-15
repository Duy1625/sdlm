'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatWithAdminButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleChatWithAdmin = async () => {
    try {
      setLoading(true)

      // Get admin user
      const adminResponse = await fetch('/api/admin/info')
      const adminData = await adminResponse.json()

      if (!adminData.admin) {
        alert('Không tìm thấy admin. Vui lòng thử lại sau.')
        return
      }

      // Create or get conversation with admin (no listing)
      const response = await fetch('/api/messages/conversations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otherUserId: adminData.admin.id,
          listingId: null // null = admin support chat
        })
      })

      const data = await response.json()

      if (data.conversation) {
        // Navigate to the conversation
        router.push(`/messages/${data.conversation.id}`)
        router.refresh()
      } else {
        alert('Không thể tạo cuộc trò chuyện. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Failed to create admin chat:', error)
      alert('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleChatWithAdmin}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
      </svg>
      {loading ? 'Đang tạo...' : 'Chat với Admin'}
    </button>
  )
}
