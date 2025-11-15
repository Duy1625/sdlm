import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)
    const body = await request.json()
    const { otherUserId, listingId } = body

    if (!otherUserId) {
      return NextResponse.json({ error: 'Other user ID is required' }, { status: 400 })
    }

    // Check if conversation already exists
    let conversation

    if (listingId) {
      // For listing chats: check by listingId and buyerId
      conversation = await db.conversation.findFirst({
        where: {
          listingId: listingId,
          buyerId: userId
        }
      })
    } else {
      // For admin chats: check if there's any conversation between these two users with no listing
      conversation = await db.conversation.findFirst({
        where: {
          listingId: null,
          OR: [
            { buyerId: userId, sellerId: otherUserId },
            { buyerId: otherUserId, sellerId: userId }
          ]
        }
      })
    }

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          listingId: listingId || null,
          buyerId: userId,
          sellerId: otherUserId
        }
      })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
