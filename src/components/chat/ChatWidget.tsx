'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ChatBox from './ChatBox'

export default function ChatWidget() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [openConversationId, setOpenConversationId] = useState<number | null>(null)

  // Fetch unread count
  useEffect(() => {
    if (session?.user?.id) {
      fetchUnreadCount()
      // Poll every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  // Listen for openChat event
  useEffect(() => {
    const handleOpenChat = (event: any) => {
      const { conversationId } = event.detail
      if (!session) {
        window.location.href = '/login?callbackUrl=' + encodeURIComponent(window.location.pathname)
        return
      }
      setOpenConversationId(conversationId)
      setIsOpen(true)
    }

    window.addEventListener('openChat', handleOpenChat)
    return () => window.removeEventListener('openChat', handleOpenChat)
  }, [session])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/messages/unread-count')
      const data = await response.json()
      setUnreadCount(data.count || 0)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const handleToggle = () => {
    if (!session) {
      // Redirect to login
      window.location.href = '/login?callbackUrl=' + encodeURIComponent(window.location.pathname)
      return
    }
    setIsOpen(!isOpen)
    if (!isOpen) {
      setOpenConversationId(null)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setOpenConversationId(null)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Chat"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <ChatBox
            onClose={handleClose}
            initialConversationId={openConversationId}
          />
        </div>
      )}
    </>
  )
}
