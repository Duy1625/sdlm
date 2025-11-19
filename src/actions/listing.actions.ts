'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Helper function to generate slug
function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[đ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  return `${slug}-${Date.now()}`
}

export async function createListing(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const priceMinStr = formData.get('priceMin') as string
    const priceMaxStr = formData.get('priceMax') as string
    const priceMin = priceMinStr ? parseFloat(priceMinStr) : null
    const priceMax = priceMaxStr ? parseFloat(priceMaxStr) : null
    const categoryId = parseInt(formData.get('categoryId') as string)
    const location = formData.get('location') as string
    const contactName = formData.get('contactName') as string
    const contactPhone = formData.get('contactPhone') as string
    const guestEmail = formData.get('guestEmail') as string
    const imageUrls = formData.get('imageUrls') as string // JSON string array

    // Validation
    if (!title || !description || !price || !categoryId || !contactName || !contactPhone) {
      return { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' }
    }

    // Parse image URLs
    const images = imageUrls ? JSON.parse(imageUrls) : []

    const slug = generateSlug(title)

    // Create listing
    const listingRaw = await db.listing.create({
      data: {
        title,
        slug,
        description,
        price,
        priceMin,
        priceMax,
        categoryId,
        location: location || null,
        contactName,
        contactPhone,
        userId: session?.user?.id ? parseInt(session.user.id) : null,
        guestEmail: !session?.user?.id ? guestEmail : null,
        status: 'ACTIVE',
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            isPrimary: index === 0,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
    })

    // Convert Decimal to number for serialization
    const listing = {
      ...listingRaw,
      price: Number(listingRaw.price),
      priceMin: listingRaw.priceMin ? Number(listingRaw.priceMin) : null,
      priceMax: listingRaw.priceMax ? Number(listingRaw.priceMax) : null,
    }

    revalidatePath('/')
    return { success: true, listing }
  } catch (error) {
    console.error('Create listing error:', error)
    return { error: 'Có lỗi xảy ra khi đăng tin' }
  }
}

export async function updateListing(listingId: number, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { error: 'Bạn cần đăng nhập để chỉnh sửa tin' }
    }

    // Check ownership
    const existing = await db.listing.findUnique({
      where: { id: listingId },
    })

    if (!existing) {
      return { error: 'Không tìm thấy tin đăng' }
    }

    const isAdmin = session.user.role === 'ADMIN'
    const isOwner = existing.userId === parseInt(session.user.id)

    if (!isAdmin && !isOwner) {
      return { error: 'Bạn không có quyền chỉnh sửa tin này' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const priceMinStr = formData.get('priceMin') as string
    const priceMaxStr = formData.get('priceMax') as string
    const priceMin = priceMinStr ? parseFloat(priceMinStr) : null
    const priceMax = priceMaxStr ? parseFloat(priceMaxStr) : null
    const categoryId = parseInt(formData.get('categoryId') as string)
    const location = formData.get('location') as string
    const contactName = formData.get('contactName') as string
    const contactPhone = formData.get('contactPhone') as string
    const imageUrls = formData.get('imageUrls') as string
    const status = formData.get('status') as string

    const images = imageUrls ? JSON.parse(imageUrls) : []

    // Delete old images
    await db.image.deleteMany({
      where: { listingId },
    })

    // Update listing
    const listingRaw = await db.listing.update({
      where: { id: listingId },
      data: {
        title,
        description,
        price,
        priceMin,
        priceMax,
        categoryId,
        location: location || null,
        contactName,
        contactPhone,
        status: status as any,
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            isPrimary: index === 0,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
    })

    // Convert Decimal to number for serialization
    const listing = {
      ...listingRaw,
      price: Number(listingRaw.price),
      priceMin: listingRaw.priceMin ? Number(listingRaw.priceMin) : null,
      priceMax: listingRaw.priceMax ? Number(listingRaw.priceMax) : null,
    }

    revalidatePath('/')
    revalidatePath(`/listings/${listing.slug}`)
    revalidatePath('/my-listings')
    return { success: true, listing }
  } catch (error) {
    console.error('Update listing error:', error)
    return { error: 'Có lỗi xảy ra khi cập nhật tin' }
  }
}

export async function deleteListing(listingId: number) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { error: 'Bạn cần đăng nhập để xóa tin' }
    }

    // Check ownership
    const existing = await db.listing.findUnique({
      where: { id: listingId },
    })

    if (!existing) {
      return { error: 'Không tìm thấy tin đăng' }
    }

    const isAdmin = session.user.role === 'ADMIN'
    const isOwner = existing.userId === parseInt(session.user.id)

    if (!isAdmin && !isOwner) {
      return { error: 'Bạn không có quyền xóa tin này' }
    }

    // Delete listing (images will cascade delete)
    await db.listing.delete({
      where: { id: listingId },
    })

    revalidatePath('/')
    revalidatePath('/my-listings')
    return { success: true }
  } catch (error) {
    console.error('Delete listing error:', error)
    return { error: 'Có lỗi xảy ra khi xóa tin' }
  }
}

export async function getListingBySlug(slug: string) {
  try {
    const listing = await db.listing.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    })

    if (!listing) return null

    // Convert Decimal to number for serialization
    return {
      ...listing,
      price: Number(listing.price),
      priceMin: listing.priceMin ? Number(listing.priceMin) : null,
      priceMax: listing.priceMax ? Number(listing.priceMax) : null,
    }
  } catch (error) {
    console.error('Get listing error:', error)
    return null
  }
}

export async function getUserListings() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return []
    }

    const listingsRaw = await db.listing.findMany({
      where: {
        userId: parseInt(session.user.id),
      },
      include: {
        category: true,
        images: true,
        _count: {
          select: {
            conversations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Convert Decimal to number for serialization
    return listingsRaw.map(listing => ({
      ...listing,
      price: Number(listing.price),
      priceMin: listing.priceMin ? Number(listing.priceMin) : null,
      priceMax: listing.priceMax ? Number(listing.priceMax) : null,
    }))
  } catch (error) {
    console.error('Get user listings error:', error)
    return []
  }
}

export async function markListingAsSold(listingId: number) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { error: 'Bạn cần đăng nhập' }
    }

    const existing = await db.listing.findUnique({
      where: { id: listingId },
    })

    if (!existing) {
      return { error: 'Không tìm thấy tin đăng' }
    }

    if (existing.userId !== parseInt(session.user.id)) {
      return { error: 'Bạn không có quyền thao tác' }
    }

    await db.listing.update({
      where: { id: listingId },
      data: { status: 'SOLD' },
    })

    revalidatePath('/my-listings')
    return { success: true }
  } catch (error) {
    console.error('Mark as sold error:', error)
    return { error: 'Có lỗi xảy ra' }
  }
}

export async function getAllListingsForAdmin() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return []
    }

    const listingsRaw = await db.listing.findMany({
      include: {
        category: true,
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            conversations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Convert Decimal to number for serialization
    return listingsRaw.map(listing => ({
      ...listing,
      price: Number(listing.price),
      priceMin: listing.priceMin ? Number(listing.priceMin) : null,
      priceMax: listing.priceMax ? Number(listing.priceMax) : null,
    }))
  } catch (error) {
    console.error('Get all listings for admin error:', error)
    return []
  }
}
