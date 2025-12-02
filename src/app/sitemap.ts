import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

// Revalidate sitemap every hour
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sdlm.vercel.app'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/listings/new`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Get all active listings
  try {
    const listings = await db.listing.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
      url: `${baseUrl}/listings/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    // Get all categories
    const categories = await db.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/?category=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...listingPages, ...categoryPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
