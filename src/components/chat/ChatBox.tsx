'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ChatWindow from './ChatWindow'

interface Conversation {
  id: number
  listingId: number | null
  listing: {
    id: number
    title: string
    slug: string
    images: { url: string; isPrimary: boolean }[]
  } | null
  otherUser: {
    id: number
    name: string | null
    email: string
    avatar: string | null
  } | null
  lastMessage: {
    content: string
    createdAt: string
    isRead: boolean
    senderId: number
  } | null
  unreadCount: number
  isAdminChat: boolean
}

interface ChatBoxProps {
  onClose: () => void
  initialConversationId?: number | null
}

export default function ChatBox({ onClose, initialConversationId }: ChatBoxProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchConversations()
  }, [])

  // Auto-open conversation if initialConversationId is provided
  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === initialConversationId)
      if (conv) {
        setSelectedConversation(conv)
      }
    }
  }, [initialConversationId, conversations])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/messages/conversations')
      const data = await response.json()
      console.log('📦 Fetched conversations:', data.conversations?.length || 0)

      // Log admin conversation
      const adminConv = data.conversations?.find((c: any) => c.isAdminChat)
      if (adminConv) {
        console.log('✅ Admin conversation found:', adminConv)
      }

      setConversations(data.conversations || [])
    } catch (error) {
      console.error('❌ Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    if (conv.isAdminChat) return 'admin'.includes(query) || 'chat'.includes(query)
    return (
      conv.otherUser?.name?.toLowerCase().includes(query) ||
      conv.listing?.title?.toLowerCase().includes(query)
    )
  })

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút`
    if (diffHours < 24) return `${diffHours} giờ`
    if (diffDays < 7) return `${diffDays} ngày`
    return date.toLocaleDateString('vi-VN')
  }

  if (selectedConversation) {
    return (
      <ChatWindow
        conversation={selectedConversation}
        onBack={() => {
          setSelectedConversation(null)
          fetchConversations()
        }}
        onClose={onClose}
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Chat</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Chat with Admin Button - Only show if not admin and no admin chat exists */}
      {!isAdmin && !conversations.find(c => c.isAdminChat) && (
        <div className="p-3 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <button
            onClick={async () => {
              try {
                const adminResponse = await fetch('/api/admin/info')
                const adminData = await adminResponse.json()
                if (!adminData.admin) return

                const response = await fetch('/api/messages/conversations/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    otherUserId: adminData.admin.id,
                    listingId: null
                  })
                })
                const data = await response.json()
                if (data.conversation) {
                  await fetchConversations()
                  const conv = conversations.find(c => c.id === data.conversation.id) || data.conversation
                  setSelectedConversation(conv as any)
                }
              } catch (error) {
                console.error('Failed to create admin chat:', error)
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            Chat với Admin
          </button>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center">
              {searchQuery ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có cuộc trò chuyện nào'}
            </p>
          </div>
        ) : (
          <div>
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 flex gap-3 hover:bg-gray-50 transition-colors border-b ${
                  conv.unreadCount > 0 ? 'bg-emerald-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {conv.isAdminChat ? (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : isAdmin ? (
                    // For admin: always show user avatar, never listing image
                    conv.otherUser?.avatar ? (
                      <img
                        src={conv.otherUser.avatar}
                        alt={conv.otherUser.name || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {conv.otherUser?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )
                  ) : conv.listing?.images?.[0] ? (
                    // For regular users: show listing image
                    <img
                      src={conv.listing.images[0].url}
                      alt={conv.listing.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {conv.otherUser?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold text-sm truncate ${
                      conv.unreadCount > 0 ? 'text-emerald-600' : 'text-gray-900'
                    }`}>
                      {conv.isAdminChat ? 'Admin' : (conv.otherUser?.name || conv.otherUser?.email || 'Người dùng')}
                    </h3>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>

                  {conv.listing && !conv.isAdminChat && !isAdmin && (
                    <p className="text-xs text-gray-500 truncate mb-1">
                      {conv.listing.title}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${
                      conv.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}>
                      {conv.lastMessage?.content || 'Bắt đầu cuộc trò chuyện'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 ml-2 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
