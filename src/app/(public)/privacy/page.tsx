export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Chính sách bảo mật</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-sm text-gray-600">
            Cập nhật lần cuối: <span suppressHydrationWarning>{new Date().toLocaleDateString('vi-VN')}</span>
          </p>

          <section>
            <h2 className="text-2xl font-bold mb-3">1. Thông tin chúng tôi thu thập</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Wedosa cam kết bảo vệ quyền riêng tư của người dùng. Chúng tôi có
              thể thu thập các thông tin sau:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Thông tin truy cập website (IP, trình duyệt, thời gian)</li>
              <li>Cookies để cải thiện trải nghiệm người dùng</li>
              <li>Thông tin bạn cung cấp khi liên hệ với chúng tôi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Cách chúng tôi sử dụng thông tin</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Thông tin thu thập được sử dụng để:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Cải thiện dịch vụ và trải nghiệm người dùng</li>
              <li>Phân tích thống kê lượt truy cập</li>
              <li>Phản hồi các yêu cầu hỗ trợ</li>
              <li>Tuân thủ các yêu cầu pháp lý</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. Bảo mật thông tin</h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi sử dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin
              của bạn khỏi truy cập, sử dụng hoặc tiết lộ trái phép. Tuy nhiên,
              không có phương thức truyền tải qua Internet nào là 100% an toàn.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Website sử dụng cookies để cải thiện trải nghiệm người dùng. Bạn có
              thể tắt cookies trong cài đặt trình duyệt, tuy nhiên điều này có thể
              ảnh hưởng đến một số tính năng của website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Chia sẻ thông tin với bên thứ ba</h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi không bán, trao đổi hoặc cho thuê thông tin cá nhân của
              bạn cho bên thứ ba. Thông tin chỉ được chia sẻ khi có yêu cầu pháp
              lý hoặc để bảo vệ quyền lợi của chúng tôi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Quyền của bạn</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Bạn có quyền:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Yêu cầu truy cập thông tin cá nhân của bạn</li>
              <li>Yêu cầu chỉnh sửa hoặc xóa thông tin</li>
              <li>Phản đối việc xử lý thông tin cá nhân</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Thay đổi chính sách</h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi có quyền cập nhật Chính sách bảo mật này bất kỳ lúc nào.
              Các thay đổi sẽ được đăng tải trên trang này.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Liên hệ</h2>
            <p className="text-gray-700 leading-relaxed">
              Nếu bạn có câu hỏi về Chính sách bảo mật, vui lòng liên hệ:
              contact@wedosa.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
