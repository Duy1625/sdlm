'use client'

import { useState, useTransition } from 'react'
import { getOrCreateConversation } from '@/actions/message.actions'

interface ChatButtonProps {
  listingId: number
  sellerId: number
  listingTitle: string
}

export default function ChatButton({ listingId, sellerId, listingTitle }: ChatButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    setError(null)
    startTransition(async () => {
      const result = await getOrCreateConversation(listingId, sellerId)

      if (result.error) {
        setError(result.error)
      } else if (result.success && result.conversation) {
        // Dispatch custom event to open chat widget with this conversation
        window.dispatchEvent(new CustomEvent('openChat', {
          detail: { conversationId: result.conversation.id }
        }))
      }
    })
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="w-full py-3 bg-white border-2 border-emerald-500 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {isPending ? 'Đang tải...' : 'Chat với người bán'}
        </div>
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
