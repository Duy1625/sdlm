import { getAllListingsForAdmin } from '@/actions/listing.actions'
import AdminListingsManager from '@/components/admin/AdminListingsManager'

export default async function AdminListingsPage() {
  const listings = await getAllListingsForAdmin()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý tin đăng</h1>
        <p className="text-gray-600 mt-2">
          Quản lý tất cả tin đăng trên hệ thống. Admin có thể chỉnh sửa hoặc xóa tin vi phạm.
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Chưa có tin đăng nào</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Tổng số: <span className="font-semibold">{listings.length}</span> tin đăng
          </div>
          <AdminListingsManager listings={listings} />
        </>
      )}
    </div>
  )
}
