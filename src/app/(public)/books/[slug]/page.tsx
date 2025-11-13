import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

interface BookDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug } = await params

  const book = await db.book.findUnique({
    where: { slug },
    include: {
      chapters: {
        orderBy: {
          chapterNumber: 'asc',
        },
      },
    },
  })

  if (!book) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Book Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-48 h-72 flex-shrink-0 mx-auto md:mx-0">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {book.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-lg text-gray-600 mb-4">Tác giả: {book.author}</p>

              {book.genre && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {book.genre}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    book.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {book.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang viết'}
                </span>
                <span className="text-gray-600">
                  {book.chapters.length} chương
                </span>
              </div>

              {book.description && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </div>
              )}

              {book.chapters.length > 0 && (
                <div className="mt-6">
                  <Link href={`/books/${book.slug}/${book.chapters[0].slug}`}>
                    <Button size="lg">Đọc ngay</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Danh sách chương</h2>

          {book.chapters.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Chưa có chương nào.
            </p>
          ) : (
            <div className="space-y-2">
              {book.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/books/${book.slug}/${chapter.slug}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 hover:border-primary-500 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500 mr-2">
                        Chương {chapter.chapterNumber}
                      </span>
                      <span className="font-medium">{chapter.title}</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
