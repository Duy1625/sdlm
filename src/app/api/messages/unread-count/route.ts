import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    // Get all conversations where user is involved
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      select: {
        id: true
      }
    })

    const conversationIds = conversations.map(c => c.id)

    // Count unread messages
    const count = await db.message.count({
      where: {
        conversationId: { in: conversationIds },
        senderId: { not: userId },
        isRead: false
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Unread count error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
