import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import UserMenu from './UserMenu'
import HeaderSearchBar from './HeaderSearchBar'

export default async function Header() {
  const session = await getServerSession(authOptions)

  const categories = [
    {
      name: 'Đồ ăn, đồ uống',
      href: '/?category=do-an-do-uong',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      )
    },
    {
      name: 'Dịch vụ',
      href: '/?category=dich-vu',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Đồ gia dụng',
      href: '/?category=do-gia-dung',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      name: 'Thời trang',
      href: '/?category=thoi-trang',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Điện tử',
      href: '/?category=dien-tu',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Xe cộ',
      href: '/?category=xe-co',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      )
    },
    {
      name: 'Khác',
      href: '/?category=khac',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
        </svg>
      )
    }
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-emerald-100/50 shadow-lg shadow-emerald-100/50">
      {/* Top Bar */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-4 h-16 sm:h-20">
          <Link href="/" className="group flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-primary rounded-lg sm:rounded-xl text-white font-bold text-sm sm:text-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <span className="hidden sm:inline">Sadec Local Market</span>
                <span className="sm:hidden">SDLM</span>
              </div>
            </div>
          </Link>

          <div className="flex-1 max-w-2xl">
            <HeaderSearchBar />
          </div>

          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <Link
              href="/listings/new"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-emerald-600 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Đăng tin
            </Link>

            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <>
                <Link
                  href="/register"
                  className="hidden sm:inline-block px-3 sm:px-6 py-1.5 sm:py-2 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-lg sm:rounded-xl hover:bg-emerald-50 transition-all text-sm"
                >
                  Đăng ký
                </Link>
                <Link
                  href="/login"
                  className="px-3 sm:px-6 py-1.5 sm:py-2 bg-gradient-primary text-white font-semibold rounded-lg sm:rounded-xl hover:shadow-lg transition-all text-sm"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 border-t border-emerald-700/30">
        <div className="container mx-auto px-0">
          <nav className="flex items-center justify-start gap-1 overflow-x-auto py-2 sm:py-3 scrollbar-hide px-3 sm:px-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 whitespace-nowrap text-xs sm:text-sm font-medium flex-shrink-0"
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5">{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
