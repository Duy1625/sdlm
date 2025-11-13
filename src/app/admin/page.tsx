import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import AnalyticsStats from '@/components/admin/AnalyticsStats'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  // Get statistics
  const [totalListings, totalUsers, activeListings, soldListings, totalCategories] = await Promise.all([
    db.listing.count(),
    db.user.count(),
    db.listing.count({ where: { status: 'ACTIVE' } }),
    db.listing.count({ where: { status: 'SOLD' } }),
    db.category.count()
  ])

  const stats = [
    { label: 'Tổng tin đăng', value: totalListings, icon: '📝', color: 'bg-blue-500' },
    { label: 'Người dùng', value: totalUsers, icon: '👥', color: 'bg-green-500' },
    { label: 'Đang hoạt động', value: activeListings, icon: '✅', color: 'bg-emerald-500' },
    { label: 'Đã bán', value: soldListings, icon: '💰', color: 'bg-purple-500' }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Xin chào, <span className="font-semibold">{session?.user?.name || session?.user?.email}</span>!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quản lý nhanh</h2>
          <div className="space-y-3">
            <Link
              href="/admin/listings"
              className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              📝 Quản lý tin đăng
            </Link>
            <Link
              href="/"
              className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
            >
              🏠 Xem trang chủ
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin hệ thống</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Danh mục:</span>
              <span className="font-semibold text-gray-900">{totalCategories}</span>
            </div>
            <div className="flex justify-between">
              <span>Tin bị ẩn:</span>
              <span className="font-semibold text-gray-900">
                {totalListings - activeListings - soldListings}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Tổng cộng:</span>
              <span className="font-bold text-gray-900">{totalListings} tin đăng</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="mt-8">
        <Card className="p-6">
          <AnalyticsStats />
        </Card>
      </div>
    </div>
  )
}
