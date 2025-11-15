import { getUserConversations } from '@/actions/message.actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const conversations = await getUserConversations()
  const userId = parseInt(session.user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-emerald-600 mb-4">
            <Link href="/" className="hover:text-emerald-700">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-gray-800">Tin nhắn</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Tin nhắn của bạn
            </span>
          </h1>
          <p className="text-gray-600">
            Quản lý tất cả các cuộc trò chuyện với người mua và người bán
          </p>
        </div>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có tin nhắn nào</h3>
            <p className="text-gray-600 mb-6">
              Bắt đầu trò chuyện bằng cách chat với người bán trong các tin đăng
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Khám phá tin đăng
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => {
              const otherUser = conversation.buyerId === userId ? conversation.seller : conversation.buyer
              const lastMessage = conversation.messages[0]
              const unreadCount = conversation._count.messages
              const isAdminChat = !conversation.listing
              const primaryImage = conversation.listing?.images?.[0]

              return (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="block bg-white rounded-2xl border border-gray-200 p-6 hover:border-emerald-500 hover:shadow-lg transition-all"
                >
                  <div className="flex gap-4">
                    {/* Avatar/Image */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      {isAdminChat ? (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : primaryImage ? (
                        <img
                          src={primaryImage.url}
                          alt={conversation.listing?.title || 'Listing'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      {/* Other User */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                          isAdminChat ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-primary'
                        }`}>
                          {isAdminChat ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            otherUser.name?.charAt(0).toUpperCase() || '?'
                          )}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {isAdminChat ? 'Admin' : (otherUser.name || 'Người dùng')}
                        </span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Listing Title - only show for non-admin chats */}
                      {!isAdminChat && conversation.listing && (
                        <p className="text-sm text-gray-600 mb-1 truncate">
                          {conversation.listing.title}
                        </p>
                      )}

                      {/* Last Message */}
                      {lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage.senderId === userId ? 'Bạn: ' : ''}
                          {lastMessage.content}
                        </p>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conversation.updatedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
