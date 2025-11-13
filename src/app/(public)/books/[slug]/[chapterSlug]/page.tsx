import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer'

interface ChapterPageProps {
  params: Promise<{
    slug: string
    chapterSlug: string
  }>
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug, chapterSlug } = await params

  const book = await db.book.findUnique({
    where: { slug },
  })

  if (!book) {
    notFound()
  }

  const chapter = await db.chapter.findFirst({
    where: {
      bookId: book.id,
      slug: chapterSlug,
    },
  })

  if (!chapter) {
    notFound()
  }

  // Get previous and next chapters
  const prevChapter = await db.chapter.findFirst({
    where: {
      bookId: book.id,
      chapterNumber: {
        lt: chapter.chapterNumber,
      },
    },
    orderBy: {
      chapterNumber: 'desc',
    },
  })

  const nextChapter = await db.chapter.findFirst({
    where: {
      bookId: book.id,
      chapterNumber: {
        gt: chapter.chapterNumber,
      },
    },
    orderBy: {
      chapterNumber: 'asc',
    },
  })

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-primary-600">
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/books/${book.slug}`}
                className="hover:text-primary-600"
              >
                {book.title}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{chapter.title}</li>
          </ol>
        </nav>

        {/* Chapter Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center border-b pb-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">
              {book.title} - {book.author}
            </p>
            <h1 className="text-2xl font-bold">
              Chương {chapter.chapterNumber}: {chapter.title}
            </h1>
          </div>

          {/* Navigation - Top */}
          {prevChapter && (
            <div className="mb-4">
              <Link href={`/books/${book.slug}/${prevChapter.slug}`}>
                <Button variant="outline" className="w-full sm:w-auto">
                  ← Chương trước
                </Button>
              </Link>
            </div>
          )}

          {/* Chapter Content */}
          <div className="py-6">
            <MarkdownRenderer content={chapter.content} />
          </div>

          {/* Navigation - Bottom */}
          <div className="border-t pt-6 mt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                {prevChapter && (
                  <Link href={`/books/${book.slug}/${prevChapter.slug}`}>
                    <Button variant="outline">
                      ← Chương {prevChapter.chapterNumber}
                    </Button>
                  </Link>
                )}
              </div>

              <Link href={`/books/${book.slug}`}>
                <Button variant="secondary">Danh sách chương</Button>
              </Link>

              <div>
                {nextChapter && (
                  <Link href={`/books/${book.slug}/${nextChapter.slug}`}>
                    <Button>
                      Chương {nextChapter.chapterNumber} →
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back to book link */}
        <div className="text-center">
          <Link
            href={`/books/${book.slug}`}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            ← Quay lại trang sách
          </Link>
        </div>
      </div>
    </div>
  )
}
