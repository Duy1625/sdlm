import { getBookById } from '@/actions/book.actions'
import BookForm from '@/components/admin/BookForm'
import Card from '@/components/ui/Card'
import { notFound } from 'next/navigation'

export default async function EditBookPage({
  params
}: {
  params: { id: string }
}) {
  const bookId = parseInt(params.id)

  if (isNaN(bookId)) {
    notFound()
  }

  const result = await getBookById(bookId)

  if (!result.success || !result.data) {
    notFound()
  }

  const book = result.data

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sửa sách</h1>
        <p className="text-gray-600 mt-2">Cập nhật thông tin sách: {book.title}</p>
      </div>

      <Card className="p-8">
        <BookForm
          mode="edit"
          initialData={{
            id: book.id,
            title: book.title,
            slug: book.slug,
            author: book.author,
            description: book.description || '',
            coverImage: book.coverImage || '',
            status: book.status,
            genre: book.genre || ''
          }}
        />
      </Card>
    </div>
  )
}
