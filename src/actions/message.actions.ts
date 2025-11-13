'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getOrCreateConversation(listingId: number, sellerId: number) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { error: 'Bạn cần đăng nhập để chat' }
    }

    const buyerId = parseInt(session.user.id)

    // Don't allow seller to chat with themselves
    if (buyerId === sellerId) {
      return { error: 'Bạn không thể chat với chính mình' }
    }

    // Check if conversation exists
    let conversation = await db.conversation.findUnique({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          listingId,
          buyerId,
          sellerId,
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })
    }

    return { success: true, conversation }
  } catch (error) {
    console.error('Get or create conversation error:', error)
    return { error: 'Có lỗi xảy ra khi tạo cuộc trò chuyện' }
  }
}

export async function sendMessage(conversationId: number, content: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { error: 'Bạn cần đăng nhập để gửi tin nhắn' }
    }

    const senderId = parseInt(session.user.id)

    // Verify user is part of conversation
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      return { error: 'Không tìm thấy cuộc trò chuyện' }
    }

    if (conversation.buyerId !== senderId && conversation.sellerId !== senderId) {
      return { error: 'Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này' }
    }

    // Create message
    const message = await db.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Update conversation timestamp
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    revalidatePath(`/messages/${conversationId}`)
    revalidatePath('/messages')
    return { success: true, message }
  } catch (error) {
    console.error('Send message error:', error)
    return { error: 'Có lỗi xảy ra khi gửi tin nhắn' }
  }
}

export async function getConversation(conversationId: number) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return null
    }

    const userId = parseInt(session.user.id)

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!conversation) {
      return null
    }

    // Verify user is part of conversation
    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      return null
    }

    // Mark messages as read
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return conversation
  } catch (error) {
    console.error('Get conversation error:', error)
    return null
  }
}

export async function getUserConversations() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return []
    }

    const userId = parseInt(session.user.id)

    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId },
        ],
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: userId },
                isRead: false,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return conversations
  } catch (error) {
    console.error('Get user conversations error:', error)
    return []
  }
}

export async function deleteConversation(conversationId: number) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { error: 'Bạn cần đăng nhập' }
    }

    const userId = parseInt(session.user.id)

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      return { error: 'Không tìm thấy cuộc trò chuyện' }
    }

    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      return { error: 'Bạn không có quyền xóa cuộc trò chuyện này' }
    }

    await db.conversation.delete({
      where: { id: conversationId },
    })

    revalidatePath('/messages')
    return { success: true }
  } catch (error) {
    console.error('Delete conversation error:', error)
    return { error: 'Có lỗi xảy ra khi xóa cuộc trò chuyện' }
  }
}
