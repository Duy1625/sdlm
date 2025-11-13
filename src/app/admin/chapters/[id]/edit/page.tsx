import { getChapterById } from '@/actions/chapter.actions'
import { getAllBooks } from '@/actions/book.actions'
import ChapterForm from '@/components/admin/ChapterForm'
import Card from '@/components/ui/Card'
import { notFound } from 'next/navigation'

export default async function EditChapterPage({
  params
}: {
  params: { id: string }
}) {
  const chapterId = parseInt(params.id)

  if (isNaN(chapterId)) {
    notFound()
  }

  const [chapterResult, booksResult] = await Promise.all([
    getChapterById(chapterId),
    getAllBooks()
  ])

  if (!chapterResult.success || !chapterResult.data) {
    notFound()
  }

  const chapter = chapterResult.data
  const books = booksResult.success ? booksResult.data || [] : []

  const bookOptions = books.map((book: any) => ({
    id: book.id,
    title: book.title
  }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sửa chương</h1>
        <p className="text-gray-600 mt-2">
          Cập nhật: Chương {chapter.chapterNumber} - {chapter.title}
        </p>
      </div>

      <Card className="p-8">
        <ChapterForm
          mode="edit"
          books={bookOptions}
          initialData={{
            id: chapter.id,
            bookId: chapter.bookId,
            chapterNumber: chapter.chapterNumber,
            title: chapter.title,
            slug: chapter.slug,
            content: chapter.content
          }}
        />
      </Card>
    </div>
  )
}
