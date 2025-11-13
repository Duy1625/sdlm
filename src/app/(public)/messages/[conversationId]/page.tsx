import { getConversation } from '@/actions/message.actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ChatInterface from '@/components/messages/ChatInterface'

interface ConversationPageProps {
  params: {
    conversationId: string
  }
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const conversationId = parseInt(params.conversationId)
  const conversation = await getConversation(conversationId)

  if (!conversation) {
    notFound()
  }

  const userId = parseInt(session.user.id)
  const otherUser = conversation.buyerId === userId ? conversation.seller : conversation.buyer
  const primaryImage = conversation.listing.images[0]

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/messages"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            <div className="flex-1 flex items-center gap-4">
              {/* Listing Preview */}
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg flex-1 min-w-0">
                {primaryImage && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={primaryImage.url}
                      alt={conversation.listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/listings/${conversation.listing.slug}`}
                    className="text-sm font-semibold text-gray-800 hover:text-emerald-600 truncate block"
                  >
                    {conversation.listing.title}
                  </Link>
                  <p className="text-xs text-gray-600">Xem chi tiết →</p>
                </div>
              </div>

              {/* Other User Info */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {otherUser.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {otherUser.name || 'Người dùng'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {conversation.buyerId === userId ? 'Người bán' : 'Người mua'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <div className="container max-w-5xl mx-auto h-full">
          <ChatInterface
            conversationId={conversation.id}
            messages={conversation.messages}
            currentUserId={userId}
          />
        </div>
      </div>
    </div>
  )
}
