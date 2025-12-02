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
    default: 'SDLM - Chợ Rao Vặt Sa Đéc, Đồng Tháp | Mua Bán Online',
    template: '%s | SDLM Sa Đéc'
  },
  description: 'Chợ rao vặt trực tuyến Sa Đéc, Đồng Tháp - Mua bán iPhone, điện thoại, xe máy, đồ điện tử tại Sa Đéc. Đăng tin miễn phí, giao dịch nhanh chóng.',
  keywords: [
    'chợ rao vặt sa đéc', 'mua bán sa đéc', 'sdlm', 'sadec local market',
    'mua bán đồng tháp', 'rao vặt đồng tháp', 'chợ online sa đéc',
    'iphone sa đéc', 'điện thoại sa đéc', 'mua bán điện thoại sa đéc',
    'xe máy sa đéc', 'đồ cũ sa đéc', 'rao vặt địa phương sa đéc'
  ],
  authors: [{ name: 'SDLM - Sadec Local Market' }],
  creator: 'SDLM',
  publisher: 'SDLM - Sadec Local Market',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://sdlm.vercel.app',
    siteName: 'SDLM - Chợ Rao Vặt Sa Đéc',
    title: 'SDLM - Chợ Rao Vặt Sa Đéc, Đồng Tháp',
    description: 'Mua bán iPhone, điện thoại, xe máy, đồ điện tử tại Sa Đéc, Đồng Tháp. Đăng tin miễn phí!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SDLM - Chợ Rao Vặt Sa Đéc',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SDLM - Chợ Rao Vặt Sa Đéc, Đồng Tháp',
    description: 'Mua bán iPhone, điện thoại, xe máy, đồ điện tử tại Sa Đéc. Đăng tin miễn phí!',
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
    google: 'your-google-verification-code', // Thay đổi sau khi có Google Search Console
  },
  alternates: {
    canonical: 'https://sdlm.vercel.app',
  },
}

// LocalBusiness Schema for local SEO
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://sdlm.vercel.app',
  name: 'SDLM - Sadec Local Market',
  description: 'Chợ rao vặt trực tuyến tại Sa Đéc, Đồng Tháp. Mua bán điện thoại, xe máy, đồ điện tử.',
  url: 'https://sdlm.vercel.app',
  logo: 'https://sdlm.vercel.app/logo.png',
  image: 'https://sdlm.vercel.app/og-image.jpg',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sa Đéc',
    addressRegion: 'Đồng Tháp',
    addressCountry: 'VN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 10.2899,
    longitude: 105.7594,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Sa Đéc',
    },
    {
      '@type': 'State',
      name: 'Đồng Tháp',
    },
  ],
  priceRange: '₫',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
}

// WebSite Schema for sitelinks search box
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SDLM - Sadec Local Market',
  alternateName: ['SDLM', 'Chợ Rao Vặt Sa Đéc', 'Sadec Local Market'],
  url: 'https://sdlm.vercel.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://sdlm.vercel.app/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <PageViewTracker />
          {children}
        </Providers>
      </body>
    </html>
  )
}
