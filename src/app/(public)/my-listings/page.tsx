import { getUserListings, deleteListing, markListingAsSold } from '@/actions/listing.actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MyListingsManager from '@/components/listings/MyListingsManager'

export default async function MyListingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const listings = await getUserListings()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-emerald-600 mb-4">
            <Link href="/" className="hover:text-emerald-700">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-gray-800">Tin đăng của tôi</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Quản lý tin đăng
                </span>
              </h1>
              <p className="text-gray-600">
                Bạn có {listings.length} tin đăng
              </p>
            </div>

            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Đăng tin mới
            </Link>
          </div>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có tin đăng nào</h3>
            <p className="text-gray-600 mb-6">
              Bắt đầu đăng tin để bán hàng ngay hôm nay
            </p>
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Đăng tin đầu tiên
            </Link>
          </div>
        ) : (
          <MyListingsManager listings={listings} />
        )}
      </div>
    </div>
  )
}
