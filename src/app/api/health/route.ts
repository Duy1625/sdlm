import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    await db.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      database: 'failed',
      error: error.message,
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    }, { status: 500 })
  }
}
