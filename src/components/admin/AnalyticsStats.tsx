'use client'

import { useEffect, useState } from 'react'

interface AnalyticsData {
  pageViews: {
    today: number
    week: number
    month: number
    total: number
  }
  uniqueVisitors: {
    today: number
    week: number
    month: number
  }
  popularPages: {
    path: string
    views: number
  }[]
}

export default function AnalyticsStats() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    // Refresh every 60 seconds
    const interval = setInterval(fetchAnalytics, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/stats')
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        Không thể tải dữ liệu thống kê
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Views Stats */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Lượt truy cập</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Hôm nay"
            value={data.pageViews.today}
            icon="📅"
            color="bg-blue-500"
          />
          <StatCard
            title="7 ngày qua"
            value={data.pageViews.week}
            icon="📊"
            color="bg-emerald-500"
          />
          <StatCard
            title="30 ngày qua"
            value={data.pageViews.month}
            icon="📈"
            color="bg-purple-500"
          />
          <StatCard
            title="Tổng cộng"
            value={data.pageViews.total}
            icon="🌐"
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Unique Visitors */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Người dùng duy nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Hôm nay"
            value={data.uniqueVisitors.today}
            icon="👤"
            color="bg-cyan-500"
          />
          <StatCard
            title="7 ngày qua"
            value={data.uniqueVisitors.week}
            icon="👥"
            color="bg-teal-500"
          />
          <StatCard
            title="30 ngày qua"
            value={data.uniqueVisitors.month}
            icon="👨‍👩‍👧‍👦"
            color="bg-indigo-500"
          />
        </div>
      </div>

      {/* Popular Pages */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Trang phổ biến nhất</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đường dẫn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lượt xem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.popularPages.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                    Chưa có dữ liệu
                  </td>
                </tr>
              ) : (
                data.popularPages.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {page.path === '/' ? 'Trang chủ' : page.path}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.views.toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: string
  color: string
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value.toLocaleString('vi-VN')}
          </p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
