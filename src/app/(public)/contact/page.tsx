export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Liên hệ</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-700 mb-6">
            Chúng tôi rất vui được lắng nghe ý kiến đóng góp của bạn. Hãy liên hệ
            với chúng tôi qua các kênh sau:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-gray-700">
                <a
                  href="mailto:contact@wedosa.com"
                  className="text-primary-600 hover:text-primary-700"
                >
                  contact@wedosa.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Địa chỉ</h3>
              <p className="text-gray-700">
                Hà Nội, Việt Nam
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Giờ làm việc</h3>
              <p className="text-gray-700">
                Thứ 2 - Thứ 6: 9:00 - 18:00
                <br />
                Thứ 7 - Chủ nhật: Nghỉ
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Lưu ý:</strong> Chúng tôi sẽ phản hồi email của bạn trong
              vòng 24-48 giờ làm việc.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
