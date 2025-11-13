import { getAllBooks } from '@/actions/book.actions'
import ChapterForm from '@/components/admin/ChapterForm'
import Card from '@/components/ui/Card'

export default async function NewChapterPage() {
  const booksResult = await getAllBooks()
  const books = booksResult.success ? booksResult.data || [] : []

  const bookOptions = books.map((book: any) => ({
    id: book.id,
    title: book.title
  }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thêm chương mới</h1>
        <p className="text-gray-600 mt-2">Điền thông tin để tạo chương mới</p>
      </div>

      <Card className="p-8">
        <ChapterForm mode="create" books={bookOptions} />
      </Card>
    </div>
  )
}
