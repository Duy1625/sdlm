/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Set body size limit to 4.5MB (Vercel limit)
  experimental: {
    serverActions: {
      bodySizeLimit: '4.5mb',
    },
  },
}

module.exports = nextConfig
