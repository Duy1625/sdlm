import Link from 'next/link'
import Image from 'next/image'
import { BookWithChapterCount } from '@/types'

interface BookCardProps {
  book: BookWithChapterCount
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.slug}`} className="group block h-full">
      <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-primary opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10 rounded-2xl"></div>

        <div className="relative">
          {/* Book Cover */}
          <div className="relative aspect-[2/3] overflow-hidden">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="relative h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent animate-shine bg-[length:200%_200%]"></div>
                </div>

                <span className="relative text-white text-6xl font-bold drop-shadow-2xl">
                  {book.title.charAt(0)}
                </span>
              </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Content */}
          <div className="p-5 relative">
            {/* Title */}
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-primary transition-all duration-300">
              {book.title}
            </h3>

            {/* Author */}
            <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {book.author}
            </p>

            {/* Description */}
            {book.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {book.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200/50">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-sm font-medium text-emerald-700">
                  {book._count.chapters} chương
                </span>
              </div>

              <div
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                  book.status === 'COMPLETED'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                }`}
              >
                {book.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang viết'}
              </div>
            </div>

            {/* Genre Tag */}
            {book.genre && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-full text-xs font-medium text-emerald-700 shadow-sm">
                <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                {book.genre}
              </div>
            )}

            {/* Read More Button */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-emerald-600 group-hover:text-emerald-700">Xem chi tiết</span>
                <svg className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
