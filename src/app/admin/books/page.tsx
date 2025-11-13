import Link from 'next/link'
import { getAllBooks, deleteBook } from '@/actions/book.actions'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import DeleteBookButton from '@/components/admin/DeleteBookButton'

export default async function BooksListPage() {
  const result = await getAllBooks()

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Lỗi: {result.error}</p>
      </div>
    )
  }

  const books = result.data || []

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Sách</h1>
          <p className="text-gray-600 mt-2">Tổng số: {books.length} sách</p>
        </div>
        <Link href="/admin/books/new">
          <Button>➕ Thêm sách mới</Button>
        </Link>
      </div>

      {books.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">Chưa có sách nào</p>
          <Link href="/admin/books/new">
            <Button>Thêm sách đầu tiên</Button>
          </Link>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thể loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số chương
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book: any) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500">{book.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {book.genre || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      book.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {book.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang viết'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {book._count.chapters}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/books/${book.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Xem
                    </Link>
                    <Link
                      href={`/admin/books/${book.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Sửa
                    </Link>
                    <DeleteBookButton bookId={book.id} bookTitle={book.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
