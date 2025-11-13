import Link from 'next/link'
import { getAllChapters } from '@/actions/chapter.actions'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import DeleteChapterButton from '@/components/admin/DeleteChapterButton'

export default async function ChaptersListPage({
  searchParams
}: {
  searchParams: { bookId?: string }
}) {
  const bookId = searchParams.bookId ? parseInt(searchParams.bookId) : undefined
  const result = await getAllChapters(bookId)

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Lỗi: {result.error}</p>
      </div>
    )
  }

  const chapters = result.data || []

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Chương</h1>
          <p className="text-gray-600 mt-2">Tổng số: {chapters.length} chương</p>
        </div>
        <Link href="/admin/chapters/new">
          <Button>➕ Thêm chương mới</Button>
        </Link>
      </div>

      {chapters.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">Chưa có chương nào</p>
          <Link href="/admin/chapters/new">
            <Button>Thêm chương đầu tiên</Button>
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
                  Chương
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chapters.map((chapter: any) => (
                <tr key={chapter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {chapter.book.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Chương {chapter.chapterNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {chapter.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {chapter.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/books/${chapter.book.slug}/${chapter.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Xem
                    </Link>
                    <Link
                      href={`/admin/chapters/${chapter.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Sửa
                    </Link>
                    <DeleteChapterButton
                      chapterId={chapter.id}
                      chapterTitle={chapter.title}
                    />
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
