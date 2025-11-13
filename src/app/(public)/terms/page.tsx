export default function TermsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Điều khoản sử dụng</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-sm text-gray-600">
            Cập nhật lần cuối: <span suppressHydrationWarning>{new Date().toLocaleDateString('vi-VN')}</span>
          </p>

          <section>
            <h2 className="text-2xl font-bold mb-3">1. Chấp nhận điều khoản</h2>
            <p className="text-gray-700 leading-relaxed">
              Bằng việc truy cập và sử dụng website Wedosa, bạn đồng ý tuân thủ
              các điều khoản và điều kiện sau đây. Nếu bạn không đồng ý với bất
              kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ
              của chúng tôi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Sử dụng dịch vụ</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Wedosa cung cấp nền tảng đọc sách online miễn phí. Bạn có trách
              nhiệm:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Sử dụng dịch vụ cho mục đích hợp pháp</li>
              <li>Không vi phạm bản quyền của tác giả và nhà xuất bản</li>
              <li>Không sao chép, phân phối nội dung trái phép</li>
              <li>Không can thiệp vào hoạt động của website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. Bản quyền nội dung</h2>
            <p className="text-gray-700 leading-relaxed">
              Tất cả nội dung trên Wedosa được bảo vệ bởi luật bản quyền. Bạn
              không được phép sao chép, sửa đổi, phân phối hoặc sử dụng nội dung
              cho mục đích thương mại mà không có sự cho phép bằng văn bản.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Từ chối bảo đảm</h2>
            <p className="text-gray-700 leading-relaxed">
              Dịch vụ được cung cấp &ldquo;nguyên trạng&rdquo; và &ldquo;sẵn có&rdquo;. Chúng tôi không
              đảm bảo rằng dịch vụ sẽ không bị gián đoạn hoặc không có lỗi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Thay đổi điều khoản</h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi có quyền thay đổi các điều khoản này bất kỳ lúc nào. Các
              thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Liên hệ</h2>
            <p className="text-gray-700 leading-relaxed">
              Nếu bạn có bất kỳ câu hỏi nào về Điều khoản sử dụng, vui lòng liên
              hệ với chúng tôi qua email: contact@wedosa.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
