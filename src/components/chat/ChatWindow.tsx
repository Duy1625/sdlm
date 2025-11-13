'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import EmojiPicker from './EmojiPicker'

interface Message {
  id: number
  content: string
  senderId: number
  createdAt: string
  isRead: boolean
  mediaUrl: string | null
  mediaType: string | null
}

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
  isAdminChat: boolean
}

interface ChatWindowProps {
  conversation: Conversation
  onBack: () => void
  onClose: () => void
}

export default function ChatWindow({ conversation, onBack, onClose }: ChatWindowProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: string } | null>(null)
  const [viewingMedia, setViewingMedia] = useState<{ url: string; type: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [conversation.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewingMedia) {
        setViewingMedia(null)
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [viewingMedia])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${conversation.id}`)
      const data = await response.json()
      setMessages(data.messages || [])
      setLoading(false)

      // Mark messages as read
      if (data.messages?.length > 0) {
        fetch(`/api/messages/${conversation.id}/mark-read`, { method: 'POST' })
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      alert('Chỉ hỗ trợ hình ảnh hoặc video')
      return
    }

    // Validate size
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`File quá lớn. Tối đa ${isVideo ? '50MB' : '10MB'}`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/messages/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setMediaPreview({ url: data.url, type: data.mediaType })
      } else {
        alert('Upload thất bại')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload thất bại')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && !mediaPreview) || sending) return

    setSending(true)
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation.id,
          content: newMessage.trim(),
          mediaUrl: mediaPreview?.url || null,
          mediaType: mediaPreview?.type || null
        })
      })

      if (response.ok) {
        setNewMessage('')
        setMediaPreview(null)
        fetchMessages()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua'
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            {conversation.isAdminChat ? (
              <div>
                <h3 className="font-bold">Admin</h3>
                <p className="text-xs text-emerald-100">Sadec Local Market Support</p>
              </div>
            ) : (
              <div>
                <h3 className="font-bold truncate">
                  {conversation.otherUser?.name || conversation.otherUser?.email || 'Người dùng'}
                </h3>
                {conversation.listing && !isAdmin && (
                  <Link
                    href={`/listings/${conversation.listing.slug}`}
                    className="text-xs text-emerald-100 hover:underline truncate block"
                    onClick={onClose}
                  >
                    {conversation.listing.title}
                  </Link>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Listing Info */}
      {conversation.listing && !conversation.isAdminChat && (
        isAdmin ? (
          // Admin view: only show link without image and title
          <Link
            href={`/listings/${conversation.listing.slug}`}
            onClick={onClose}
            className="p-3 border-b hover:bg-gray-50 transition-colors block text-center"
          >
            <p className="text-xs text-emerald-600">Xem tin đăng →</p>
          </Link>
        ) : (
          // Regular user view: show image, title and link
          <Link
            href={`/listings/${conversation.listing.slug}`}
            onClick={onClose}
            className="p-3 border-b flex gap-3 hover:bg-gray-50 transition-colors"
          >
            {conversation.listing.images[0] && (
              <img
                src={conversation.listing.images[0].url}
                alt={conversation.listing.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {conversation.listing.title}
              </p>
              <p className="text-xs text-emerald-600">Xem tin đăng →</p>
            </div>
          </Link>
        )
      )}

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-center">
              {conversation.isAdminChat
                ? 'Gửi tin nhắn để được hỗ trợ từ Admin'
                : 'Bắt đầu cuộc trò chuyện'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isMyMessage = message.senderId === parseInt(session?.user?.id || '0')
              const showDate = index === 0 ||
                formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt)

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex justify-center mb-4">
                      <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}

                  <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${isMyMessage ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl overflow-hidden ${
                          isMyMessage
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        {/* Media */}
                        {message.mediaUrl && (
                          <div className="mb-2">
                            {message.mediaType === 'image' ? (
                              <img
                                src={message.mediaUrl}
                                alt="Hình ảnh"
                                className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
                                onClick={() => setViewingMedia({ url: message.mediaUrl!, type: 'image' })}
                              />
                            ) : message.mediaType === 'video' ? (
                              <video
                                src={message.mediaUrl}
                                controls
                                className="max-w-full rounded-lg cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setViewingMedia({ url: message.mediaUrl!, type: 'video' })
                                }}
                              />
                            ) : null}
                          </div>
                        )}

                        {/* Text */}
                        {message.content && (
                          <p className="text-sm whitespace-pre-wrap break-words px-4 py-2">{message.content}</p>
                        )}
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white">
        {/* Media Preview */}
        {mediaPreview && (
          <div className="mb-3 relative inline-block">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-emerald-500">
              {mediaPreview.type === 'image' ? (
                <img src={mediaPreview.url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={mediaPreview.url} className="w-full h-full object-cover" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setMediaPreview(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex gap-2 items-center relative">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* File upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || sending}
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors disabled:opacity-50"
            title="Gửi hình ảnh hoặc video"
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          {/* Emoji picker button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={sending}
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors disabled:opacity-50"
            title="Chọn biểu tượng cảm xúc"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Message input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={sending}
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={(!newMessage.trim() && !mediaPreview) || sending}
            className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <EmojiPicker
              onSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>
      </form>

      {/* Media Viewer Modal */}
      {viewingMedia && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setViewingMedia(null)}
        >
          <button
            onClick={() => setViewingMedia(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {viewingMedia.type === 'image' ? (
              <img
                src={viewingMedia.url}
                alt="Xem hình ảnh"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={viewingMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-[90vh] rounded-lg"
              />
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full">
            Nhấn ESC hoặc click bên ngoài để đóng
          </div>
        </div>
      )}
    </div>
  )
}
