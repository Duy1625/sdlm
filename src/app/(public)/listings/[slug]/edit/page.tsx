import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import ListingForm from '@/components/listings/ListingForm'
import Link from 'next/link'

interface EditListingPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { slug } = await params
  const session = await getServerSession(authOptions)

  // Must be logged in
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/my-listings')
  }

  // Fetch the listing
  const listing = await db.listing.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
    },
  })

  // Check if listing exists
  if (!listing) {
    notFound()
  }

  // Check ownership (allow admin to edit any listing)
  const isAdmin = session.user.role === 'ADMIN'
  const isOwner = listing.userId === parseInt(session.user.id)

  if (!isAdmin && !isOwner) {
    redirect('/my-listings')
  }

  // Fetch all categories for the form
  const categories = await db.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: {
        orderBy: {
          name: 'asc',
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  // Convert Decimal to number
  const listingWithNumber = {
    ...listing,
    price: Number(listing.price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
      <div className="container">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link
            href="/my-listings"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại quản lý tin đăng
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Chỉnh sửa tin đăng
            </span>
          </h1>
          <p className="text-gray-600">
            Cập nhật thông tin tin đăng của bạn
          </p>
        </div>

        {/* Form */}
        <ListingForm categories={categories} listing={listingWithNumber as any} />
      </div>
    </div>
  )
}
