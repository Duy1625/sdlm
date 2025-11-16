import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Get query parameter
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ users: [] })
    }

    const searchTerm = query.trim()

    // Search users by name or email
    const users = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { username: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
      },
      take: 10, // Limit to 10 results
    })

    // If user is logged in, exclude themselves from results
    const filteredUsers = session?.user?.id
      ? users.filter(user => user.id.toString() !== session.user.id)
      : users

    return NextResponse.json({ users: filteredUsers })
  } catch (error) {
    console.error('User search error:', error)
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    )
  }
}
