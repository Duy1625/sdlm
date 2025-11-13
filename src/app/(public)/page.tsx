import { db } from '@/lib/db'
import ListingListCard from '@/components/listings/ListingListCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface HomePageProps {
  searchParams: Promise<{
    q?: string
    category?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category } = await searchParams

  // Build query conditions
  const where: any = {
    status: 'ACTIVE', // Only show active listings
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ]
  }

  if (category) {
    where.category = {
      slug: category,
    }
  }

  // Fetch listings
  const listingsRaw = await db.listing.findMany({
    where,
    include: {
      category: true,
      images: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Convert Decimal to number for serialization
  const listings = listingsRaw.map(listing => ({
    ...listing,
    price: Number(listing.price)
  }))

  // Fetch parent categories for filter
  const categories = await db.category.findMany({
    where: {
      parentId: null, // Only parent categories
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div>
      {/* Listings Grid */}
      <section id="listings" className="py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Introduction (Small Sidebar) */}
          <aside className="lg:w-72 flex-shrink-0 px-4 lg:pl-8 lg:pr-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-md hover:shadow-lg transition-shadow sticky top-24">
              <h3 className="text-lg font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent border-b border-gray-100 pb-3">
                Giới thiệu
              </h3>
              <div className="text-gray-700 space-y-3 text-xs leading-relaxed">
                <p>
                  Trang web <strong>Sadec Local Market</strong> được tạo ra với mục tiêu kết nối giữa hai bên mua bán nhanh chóng và dễ dàng hơn. Khác với bên facebook - bài viết mới sẽ đè bài cũ rất nhanh cũng như bạn khó tìm lại tin đã đăng cũng như món đồ mà mình cần.
                </p>
                <p>
                  Thứ 2 là việc phân loại, trên facebook không có phân loại hàng do đó khiến người mua bị "rối" khi muốn tìm kiếm bài viết hoặc hình ảnh nào đó. Trang web giải quyết được các vấn đề đó. Và trên web bạn chỉ cần đăng 1 lần cho món đồ mà mình bán.
                </p>
                <p>
                  Nhưng vấn đề lớn nhất của trang web lúc này là thiếu lượt truy cập. Là một trang web mới tạo do đó không ai biết đến web mình hết, do đó web rất cần sự ủng hộ của các bạn. Nếu dùng tốt, hãy chia sẻ với những người khác giúp mình, cảm ơn các bạn.
                </p>
                <p>
                  Web mình tạo với mục đích ban đầu là mong cải thiện phần nào việc mua bán tại địa phương (năm nay ế wá ế, đã vậy còn bị nước ngập, te tua xơ mướp hết '_'). Các bạn ở địa phương khác ko fải Sađéc vẫn có thể đăng bài bình thường nhe, chỉ cần có ship thì vẫn ok thôi.
                </p>
                <p>
                  Việc đăng bài trên trang web hoàn toàn miễn phí, bạn có thể đăng ký hoặc ko đăng ký đều có thể đăng bài dc. Nếu bạn sử dụng web thường xuyên bạn nên đăng ký hoặc đăng nhập facebook/google để quản lý, chỉnh sửa tin đăng. Việc đăng ký cũng rất nhanh chóng (máy nó bớt ngoo nên chỉ đký 1 lần chứ ko fải làm tới làm lui đâu).
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content - Listings */}
          <main className="flex-1 min-w-0 px-4 lg:pl-6 lg:pr-8">
            <div className="max-w-4xl mb-8">
              <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      <span className="bg-gradient-primary bg-clip-text text-transparent">
                        {q ? `Kết quả tìm kiếm: "${q}"` : category ? 'Danh sách tin đăng' : 'Tin đăng mới nhất'}
                      </span>
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {listings.length} tin đăng được tìm thấy
                    </p>
                  </div>
                </div>
              </div>

              {listings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-block p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 shadow-lg">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-4">Chưa có tin đăng nào.</p>
                    <Link
                      href="/listings/new"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Đăng tin đầu tiên
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
                  {listings.map((listing) => (
                    <ListingListCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </section>
    </div>
  )
}
