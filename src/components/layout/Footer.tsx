import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-emerald-900/20 to-cyan-900/20"></div>

      {/* Animated Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>

      <div className="relative container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <div className="inline-block px-4 py-2 bg-gradient-primary rounded-xl text-white font-bold text-xl shadow-lg">
                Sadec Local Market
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nền tảng rao vặt địa phương - Kết nối người mua và người bán. Tiện lợi, nhanh chóng, dễ dàng và hoàn toàn miễn phí!
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-primary rounded-full"></div>
              Liên kết
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all"></span>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all"></span>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-primary rounded-full"></div>
              Danh mục
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/?category=do-an-do-uong" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 transition-all"></span>
                  Đồ ăn, đồ uống
                </Link>
              </li>
              <li>
                <Link href="/?category=dien-tu" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 transition-all"></span>
                  Điện tử
                </Link>
              </li>
              <li>
                <Link href="/?category=thoi-trang" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 transition-all"></span>
                  Thời trang
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-primary rounded-full"></div>
              Chính sách
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-teal-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all"></span>
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-teal-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all"></span>
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Sadec Local Market. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-sm">
                Made with ❤️ in Sadec
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
