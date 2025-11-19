import Link from 'next/link'
import type { Listing, Category, Image } from '@prisma/client'
import { formatRelativeTime } from '@/lib/formatTime'

type ListingWithRelations = Omit<Listing, 'price' | 'priceMin' | 'priceMax'> & {
  price: number
  priceMin: number | null
  priceMax: number | null
  category: Category
  images: Image[]
}

interface ListingListCardProps {
  listing: ListingWithRelations
}

export default function ListingListCard({ listing }: ListingListCardProps) {
  const primaryImage = listing.images.find(img => img.isPrimary) || listing.images[0]

  // Format price or price range
  let priceDisplay = ''
  if (listing.priceMin && listing.priceMax) {
    const formattedMin = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(listing.priceMin))
    const formattedMax = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(listing.priceMax))
    priceDisplay = `${formattedMin} - ${formattedMax}`
  } else {
    priceDisplay = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(listing.price))
  }

  return (
    <Link href={`/listings/${listing.slug}`}>
      <div className="group bg-white border-b border-gray-200 hover:bg-gray-50 transition-all duration-200">
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative flex-shrink-0 w-48 h-36 overflow-hidden rounded-lg bg-gray-100">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {listing.title}
            </h3>

            {/* Price */}
            <div className="mb-2">
              {listing.price > 0 || (listing.priceMin && listing.priceMax) ? (
                <span className="text-xl font-bold text-emerald-600">
                  {priceDisplay}
                </span>
              ) : (
                <span className="text-lg font-semibold text-emerald-600">
                  Thỏa thuận
                </span>
              )}
            </div>

            {/* Location */}
            {listing.location && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-1">{listing.location}</span>
              </div>
            )}

            {/* Time */}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatRelativeTime(listing.createdAt)}
            </div>
          </div>

          {/* Right side - Save button */}
          <div className="flex-shrink-0 flex items-start">
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>Lưu tin</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
