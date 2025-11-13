'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/listings', label: 'Quản lý Tin đăng', icon: '📝' }
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Wedosa Admin</h1>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
