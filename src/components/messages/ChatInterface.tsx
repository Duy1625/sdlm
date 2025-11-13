'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage } from '@/actions/message.actions'

interface Message {
  id: number
  content: string
  senderId: number
  createdAt: Date
  sender: {
    id: number
    name: string | null
    avatar: string | null
  }
}

interface ChatInterfaceProps {
  conversationId: number
  messages: Message[]
  currentUserId: number
}

export default function ChatInterface({
  conversationId,
  messages: initialMessages,
  currentUserId,
}: ChatInterfaceProps) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [inputValue])

  // Auto refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 10000)

    return () => clearInterval(interval)
  }, [router])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    const content = inputValue.trim()
    if (!content) return

    setError(null)
    const tempMessage = {
      id: Date.now(),
      content,
      senderId: currentUserId,
      createdAt: new Date(),
      sender: {
        id: currentUserId,
        name: 'Bạn',
        avatar: null,
      },
    }

    // Optimistic update
    setMessages([...messages, tempMessage])
    setInputValue('')

    startTransition(async () => {
      const result = await sendMessage(conversationId, content)

      if (result.error) {
        setError(result.error)
        // Remove temp message on error
        setMessages(messages)
        setInputValue(content)
      } else {
        // Refresh to get the real message
        router.refresh()
      }
    })
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-t-2xl border border-gray-200">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Bắt đầu cuộc trò chuyện</p>
            </div>
          </div>
        )}

        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                {!isOwn && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {message.sender.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}

                {/* Message Bubble */}
                <div>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isOwn
                        ? 'bg-gradient-primary text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 px-2 ${isOwn ? 'text-right' : 'text-left'}`}>
                    {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(e)
              }
            }}
            placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)"
            rows={1}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 resize-none max-h-32"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isPending}
            className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isPending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
