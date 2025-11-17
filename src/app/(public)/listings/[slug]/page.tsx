import { getListingBySlug } from '@/actions/listing.actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ChatButton from '@/components/messages/ChatButton'
import ImageGallery from '@/components/listings/ImageGallery'
import CommentSection from '@/components/comments/CommentSection'

interface ListingPageProps {
  params: {
    slug: string
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = await getListingBySlug(params.slug)
  const session = await getServerSession(authOptions)

  if (!listing) {
    notFound()
  }

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Number(listing.price))

  const isOwner = session?.user?.id && listing.userId === parseInt(session.user.id)
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
      <div className="container">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-emerald-600">Trang chủ</Link>
            <span>/</span>
            <Link href={`/?category=${listing.category.slug}`} className="hover:text-emerald-600">
              {listing.category.icon} {listing.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{listing.title}</span>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images */}
              <ImageGallery images={listing.images} title={listing.title} />

              {/* Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                {/* Status Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {listing.category.icon} {listing.category.name}
                  </span>

                  {listing.isVerified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Đã xác thực
                    </span>
                  )}

                  {listing.status !== 'ACTIVE' && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      listing.status === 'SOLD'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {listing.status === 'SOLD' ? 'Đã bán' : 'Đã ẩn'}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {listing.title}
                </h1>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {formattedPrice}
                  </span>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
                  {listing.location && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {listing.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(listing.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Mô tả chi tiết</h2>
                  <div className="prose prose-emerald max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {listing.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <CommentSection listingId={listing.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Seller Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin người bán</h3>

                <div className="space-y-4">
                  {/* Seller Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {listing.contactName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{listing.contactName}</p>
                      {listing.user && (
                        <p className="text-sm text-gray-600">
                          {listing.user.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
                    <a
                      href={`tel:${listing.contactPhone}`}
                      className="text-lg font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      {listing.contactPhone}
                    </a>
                  </div>

                  {/* Action Buttons */}
                  {!isOwner && listing.status === 'ACTIVE' && (
                    <div className="space-y-3">
                      {/* Call Button */}
                      <a
                        href={`tel:${listing.contactPhone}`}
                        className="block w-full py-3 bg-gradient-primary text-white font-semibold rounded-xl text-center hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Gọi điện
                        </div>
                      </a>

                      {/* Chat Button */}
                      {session && listing.userId && (
                        <ChatButton
                          listingId={listing.id}
                          sellerId={listing.userId}
                          listingTitle={listing.title}
                        />
                      )}

                      {!session && listing.userId && (
                        <Link
                          href="/login"
                          className="block w-full py-3 bg-white border-2 border-emerald-500 text-emerald-600 font-semibold rounded-xl text-center hover:bg-emerald-50 transition-all"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Đăng nhập để chat
                          </div>
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Owner Actions */}
                  {isOwner && (
                    <div className="space-y-3 pt-4 border-t">
                      <Link
                        href={`/my-listings`}
                        className="block w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl text-center hover:bg-emerald-700 transition-all"
                      >
                        Quản lý tin của tôi
                      </Link>
                    </div>
                  )}

                  {/* Admin Actions */}
                  {isAdmin && !isOwner && (
                    <div className="space-y-3 pt-4 border-t border-red-200">
                      <div className="flex items-center justify-center gap-2 text-red-600 text-sm font-semibold mb-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                        ADMIN ACTIONS
                      </div>
                      <Link
                        href={`/listings/${listing.slug}/edit`}
                        className="block w-full py-3 bg-blue-600 text-white font-semibold rounded-xl text-center hover:bg-blue-700 transition-all"
                      >
                        Chỉnh sửa tin
                      </Link>
                      <Link
                        href={`/admin/listings`}
                        className="block w-full py-3 bg-gray-600 text-white font-semibold rounded-xl text-center hover:bg-gray-700 transition-all"
                      >
                        Quản lý tất cả tin
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4">
                  ⚠️ An toàn giao dịch
                </h3>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Gặp mặt trực tiếp ở nơi công cộng</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Kiểm tra kỹ sản phẩm trước khi thanh toán</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Không chuyển tiền trước</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Cẩn thận với giá quá rẻ</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
