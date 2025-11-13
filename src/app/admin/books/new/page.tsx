import BookForm from '@/components/admin/BookForm'
import Card from '@/components/ui/Card'

export default function NewBookPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thêm sách mới</h1>
        <p className="text-gray-600 mt-2">Điền thông tin để tạo sách mới</p>
      </div>

      <Card className="p-8">
        <BookForm mode="create" />
      </Card>
    </div>
  )
}
