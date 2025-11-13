import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)
    const { conversationId, content, mediaUrl, mediaType } = await request.json()

    // Either content or media must be provided
    if (!content?.trim() && !mediaUrl) {
      return NextResponse.json({ error: 'Message content or media is required' }, { status: 400 })
    }

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

    // Create message
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: content?.trim() || '',
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null
      }
    })

    // Update conversation timestamp
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
