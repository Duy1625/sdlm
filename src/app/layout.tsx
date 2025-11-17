import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import PageViewTracker from '@/components/PageViewTracker'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#10b981',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://sdlm.vercel.app'),
  title: {
    default: 'Sadec Local Market - Chợ Rao Vặt Sà Đéc | SDLM',
    template: '%s | Sadec Local Market'
  },
  description: 'Chợ rao vặt trực tuyến Sà Đéc - Mua bán, trao đổi hàng hóa và dịch vụ địa phương. Đăng tin miễn phí, tìm kiếm dễ dàng, kết nối nhanh chóng.',
  keywords: ['chợ rao vặt sà đéc', 'mua bán sà đéc', 'sadec local market', 'sdlm', 'đăng tin miễn phí', 'chợ online đồng tháp', 'rao vặt địa phương', 'mua bán đồng tháp'],
  authors: [{ name: 'Sadec Local Market' }],
  creator: 'Sadec Local Market',
  publisher: 'Sadec Local Market',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://sdlm.vercel.app',
    siteName: 'Sadec Local Market',
    title: 'Sadec Local Market - Chợ Rao Vặt Sà Đéc',
    description: 'Chợ rao vặt trực tuyến Sà Đéc - Mua bán, trao đổi hàng hóa và dịch vụ địa phương',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sadec Local Market',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sadec Local Market - Chợ Rao Vặt Sà Đéc',
    description: 'Chợ rao vặt trực tuyến Sà Đéc - Mua bán, trao đổi hàng hóa và dịch vụ địa phương',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Sẽ thay đổi sau khi có Google Search Console
  },
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
