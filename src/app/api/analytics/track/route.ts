import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }

    // Get IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Track page view
    await db.pageView.create({
      data: {
        path,
        ipAddress,
        userAgent,
        userId: session?.user?.id ? parseInt(session.user.id) : null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track page view error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
