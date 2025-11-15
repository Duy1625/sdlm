import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const admin = await db.user.findFirst({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    if (!admin) {
      return NextResponse.json({ admin: null }, { status: 404 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error('Get admin info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
