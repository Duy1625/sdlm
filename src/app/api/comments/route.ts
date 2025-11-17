import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/comments?listingId=X - Get all comments for a listing
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const listingId = searchParams.get('listingId')

    if (!listingId) {
      return NextResponse.json(
        { success: false, error: 'listingId là bắt buộc' },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: {
        listingId: parseInt(listingId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, comments })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tải comments' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { listingId, content, guestName, guestEmail } = body

    // Validation
    if (!listingId || !content) {
      return NextResponse.json(
        { success: false, error: 'listingId và content là bắt buộc' },
        { status: 400 }
      )
    }

    if (content.trim().length < 1) {
      return NextResponse.json(
        { success: false, error: 'Nội dung comment không được rỗng' },
        { status: 400 }
      )
    }

    // If not logged in, require guest name
    if (!session && !guestName) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập tên của bạn' },
        { status: 400 }
      )
    }

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(listingId) },
    })

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing không tồn tại' },
        { status: 404 }
      )
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        listingId: parseInt(listingId),
        userId: session?.user?.id ? parseInt(session.user.id) : null,
        guestName: !session ? guestName : null,
        guestEmail: !session ? guestEmail : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tạo comment' },
      { status: 500 }
    )
  }
}
