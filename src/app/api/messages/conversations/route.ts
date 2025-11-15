import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({
        error: 'Unauthorized',
        conversations: []
      }, { status: 401 })
    }

    const userId = parseInt(session.user.id)
    const isCurrentUserAdmin = session.user.role === 'ADMIN'
    console.log('🔍 GET /api/messages/conversations - User ID:', userId, 'Is Admin:', isCurrentUserAdmin)

    // Get admin user to identify admin conversations
    const adminUser = await db.user.findFirst({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true
      }
    })

    // Get all conversations (including admin chats)
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: {
              select: {
                url: true,
                isPrimary: true
              },
              orderBy: {
                isPrimary: 'desc'
              },
              take: 1
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
            isRead: true
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: userId },
                isRead: false
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Format conversations
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.buyerId === userId ? conv.seller : conv.buyer
      const isAdminChat = adminUser && otherUser.id === adminUser.id

      return {
        id: conv.id,
        listingId: conv.listingId,
        listing: isAdminChat ? null : conv.listing, // Don't show listing for admin chats
        otherUser: otherUser,
        lastMessage: conv.messages[0] || null,
        unreadCount: conv._count.messages,
        isAdminChat: isAdminChat
      }
    })

    // If current user is admin, don't show "Chat với Admin" (conversations with themselves)
    let finalConversations = formattedConversations
    if (isCurrentUserAdmin) {
      // Admin should see ALL conversations including support chats
      // Only filter out conversations where they're chatting with themselves
      finalConversations = formattedConversations.filter(c => {
        // Don't filter out admin support conversations - admin needs to see them!
        // Only filter out if the other user is ALSO admin (chatting with themselves)
        if (c.isAdminChat && c.otherUser.id === userId) return false
        return true
      })
      console.log(`🔐 Admin user - showing ${finalConversations.length} conversations (${formattedConversations.length - finalConversations.length} filtered out)`)
    } else {
      // For regular users, merge all admin conversations into one
      const adminConversations = formattedConversations.filter(c => c.isAdminChat)
      const nonAdminConversations = formattedConversations.filter(c => !c.isAdminChat)

      finalConversations = nonAdminConversations

      if (adminConversations.length > 0) {
        // Sort admin conversations by last message time
        adminConversations.sort((a, b) => {
          const timeA = a.lastMessage?.createdAt || 0
          const timeB = b.lastMessage?.createdAt || 0
          return new Date(timeB).getTime() - new Date(timeA).getTime()
        })

        // Calculate total unread count from all admin conversations
        const totalUnreadFromAdmin = adminConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

        // Use the most recent admin conversation but with combined unread count
        const mergedAdminConv = {
          ...adminConversations[0],
          unreadCount: totalUnreadFromAdmin
        }

        finalConversations.unshift(mergedAdminConv)

        console.log(`📝 Merged ${adminConversations.length} admin conversations into 1 with ${totalUnreadFromAdmin} total unread`)
      }
    }

    return NextResponse.json({ conversations: finalConversations })
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
