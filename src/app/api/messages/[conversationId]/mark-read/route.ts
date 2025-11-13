import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
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

    // Mark all messages from other user as read
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark read error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
