import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import PageViewTracker from '@/components/PageViewTracker'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'Sadec Local Market - Chợ Rao Vặt Địa Phương',
  description: 'Nền tảng rao vặt địa phương - Mua bán, trao đổi hàng hóa và dịch vụ dễ dàng, nhanh chóng',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <PageViewTracker />
          {children}
        </Providers>
      </body>
    </html>
  )
}
