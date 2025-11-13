import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)
    const conversationId = parseInt(params.conversationId)

    // Check if user is part of this conversation
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Get messages
    const messages = await db.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        content: true,
        senderId: true,
        createdAt: true,
        isRead: true,
        mediaUrl: true,
        mediaType: true
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
