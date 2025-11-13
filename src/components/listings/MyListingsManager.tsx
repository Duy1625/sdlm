'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteListing } from '@/actions/listing.actions'
import type { Listing, Category, Image } from '@prisma/client'

type ListingWithRelations = Omit<Listing, 'price'> & {
  price: number
  category: Category
  images: Image[]
  _count: {
    conversations: number
  }
}

interface MyListingsManagerProps {
  listings: ListingWithRelations[]
}

export default function MyListingsManager({ listings: initialListings }: MyListingsManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa tin "${title}"?`)) {
      return
    }

    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteListing(id)
      if (result.error) {
        alert(result.error)
      } else {
        router.refresh()
      }
      setDeletingId(null)
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {initialListings.map((listing) => {
        const primaryImage = listing.images.find(img => img.isPrimary) || listing.images[0]
        const formattedPrice = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(Number(listing.price))

        return (
          <div
            key={listing.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex gap-6">
              {/* Image */}
              <Link
                href={`/listings/${listing.slug}`}
                className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden bg-gray-100"
              >
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/listings/${listing.slug}`}
                      className="text-xl font-bold text-gray-800 hover:text-emerald-600 transition-colors block mb-2"
                    >
                      {listing.title}
                    </Link>

                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        {listing.category.icon} {listing.category.name}
                      </span>

                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        listing.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : listing.status === 'SOLD'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {listing.status === 'ACTIVE' && 'Đang hoạt động'}
                        {listing.status === 'SOLD' && 'Đã bán'}
                        {listing.status === 'HIDDEN' && 'Đã ẩn'}
                      </span>

                      {listing.isVerified && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Đã xác thực
                        </span>
                      )}
                    </div>

                    <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
                      {formattedPrice}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {listing._count.conversations} cuộc trò chuyện
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  <Link
                    href={`/listings/${listing.slug}`}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Xem tin
                  </Link>

                  <Link
                    href={`/listings/${listing.slug}/edit`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Chỉnh sửa
                  </Link>

                  <button
                    onClick={() => handleDelete(listing.id, listing.title)}
                    disabled={isPending || deletingId === listing.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {deletingId === listing.id ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
