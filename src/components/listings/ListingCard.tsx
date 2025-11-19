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

interface ListingCardProps {
  listing: ListingWithRelations
}

export default function ListingCard({ listing }: ListingCardProps) {
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
      <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200/50 hover:border-emerald-500/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-lg">
              <span>{listing.category.icon}</span>
              {listing.category.name}
            </span>
          </div>

          {/* Status Badge */}
          {listing.status !== 'ACTIVE' && (
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                listing.status === 'SOLD'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}>
                {listing.status === 'SOLD' ? 'Đã bán' : 'Hết hạn'}
              </span>
            </div>
          )}

          {/* Verified Badge */}
          {listing.isVerified && (
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white rounded-full text-xs font-medium shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Đã xác thực
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {listing.title}
          </h3>

          {/* Price */}
          <div className="mb-3">
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {priceDisplay}
            </span>
          </div>

          {/* Location */}
          {listing.location && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{listing.location}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatRelativeTime(listing.createdAt)}
            </div>

            <span className="text-xs font-medium text-emerald-600 group-hover:text-emerald-700">
              Xem chi tiết →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
