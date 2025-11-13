import { db } from '@/lib/db'
import ListingForm from '@/components/listings/ListingForm'
import Link from 'next/link'

export default async function NewListingPage() {
  // Fetch all categories with children
  const categories = await db.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: {
        orderBy: {
          name: 'asc',
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
      <div className="container">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại trang chủ
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Đăng tin rao vặt miễn phí
            </span>
          </h1>
          <p className="text-gray-600">
            Điền thông tin dưới đây để đăng tin. Bạn có thể đăng tin mà không cần đăng nhập!
          </p>
        </div>

        {/* Form */}
        <ListingForm categories={categories} />

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📌 Lưu ý khi đăng tin
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Đăng tin hoàn toàn miễn phí</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Cung cấp thông tin trung thực, chính xác</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Đăng nhập để quản lý và chỉnh sửa tin đăng</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Thêm nhiều ảnh để thu hút người mua</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500">✗</span>
              <span>Không đăng nội dung vi phạm pháp luật hoặc đạo đức</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
