import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Only admins can view analytics
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()

    // Today (from 00:00:00 to now)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayViews = await db.pageView.count({
      where: {
        createdAt: {
          gte: todayStart
        }
      }
    })

    // This week (last 7 days)
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - 7)
    const weekViews = await db.pageView.count({
      where: {
        createdAt: {
          gte: weekStart
        }
      }
    })

    // This month (last 30 days)
    const monthStart = new Date(now)
    monthStart.setDate(monthStart.getDate() - 30)
    const monthViews = await db.pageView.count({
      where: {
        createdAt: {
          gte: monthStart
        }
      }
    })

    // All time
    const totalViews = await db.pageView.count()

    // Unique visitors (based on IP address)
    const uniqueVisitorsToday = await db.pageView.findMany({
      where: {
        createdAt: {
          gte: todayStart
        },
        ipAddress: {
          not: null
        }
      },
      select: {
        ipAddress: true
      },
      distinct: ['ipAddress']
    })

    const uniqueVisitorsWeek = await db.pageView.findMany({
      where: {
        createdAt: {
          gte: weekStart
        },
        ipAddress: {
          not: null
        }
      },
      select: {
        ipAddress: true
      },
      distinct: ['ipAddress']
    })

    const uniqueVisitorsMonth = await db.pageView.findMany({
      where: {
        createdAt: {
          gte: monthStart
        },
        ipAddress: {
          not: null
        }
      },
      select: {
        ipAddress: true
      },
      distinct: ['ipAddress']
    })

    // Popular pages (top 10)
    const popularPages = await db.pageView.groupBy({
      by: ['path'],
      _count: {
        path: true
      },
      orderBy: {
        _count: {
          path: 'desc'
        }
      },
      take: 10
    })

    return NextResponse.json({
      pageViews: {
        today: todayViews,
        week: weekViews,
        month: monthViews,
        total: totalViews
      },
      uniqueVisitors: {
        today: uniqueVisitorsToday.length,
        week: uniqueVisitorsWeek.length,
        month: uniqueVisitorsMonth.length
      },
      popularPages: popularPages.map(p => ({
        path: p.path,
        views: p._count.path
      }))
    })
  } catch (error) {
    console.error('Get analytics stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
