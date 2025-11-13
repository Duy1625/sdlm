export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Giới thiệu về Wedosa</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Wedosa là nền tảng đọc sách online miễn phí, được tạo ra với sứ mệnh
            mang đến cho mọi người cơ hội tiếp cận kiến thức và văn học một cách
            dễ dàng nhất.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sứ mệnh</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Chúng tôi tin rằng kiến thức là tài sản quý giá nhất của con người.
            Wedosa hướng đến việc xây dựng một thư viện số phong phú, đa dạng
            thể loại, phục vụ nhu cầu đọc sách của mọi người hoàn toàn miễn phí.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Tính năng</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Đọc sách online hoàn toàn miễn phí</li>
            <li>Giao diện thân thiện, dễ sử dụng</li>
            <li>Hỗ trợ đọc trên mọi thiết bị</li>
            <li>Thư viện sách đa dạng thể loại</li>
            <li>Cập nhật nội dung thường xuyên</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Liên hệ</h2>
          <p className="text-gray-700 leading-relaxed">
            Nếu bạn có bất kỳ câu hỏi hoặc đóng góp nào, vui lòng liên hệ với
            chúng tôi qua trang{' '}
            <a href="/contact" className="text-primary-600 hover:text-primary-700">
              Liên hệ
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
