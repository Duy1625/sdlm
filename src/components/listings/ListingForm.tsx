'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { createListing, updateListing } from '@/actions/listing.actions'
import ImageUpload from './ImageUpload'
import type { Category, Listing, Image } from '@prisma/client'

interface ListingFormProps {
  categories: (Category & { children: Category[] })[]
  listing?: Listing & { images: Image[] }
}

export default function ListingForm({ categories, listing }: ListingFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState({
    title: listing?.title || '',
    description: listing?.description || '',
    price: listing?.price?.toString() || '',
    priceType: (listing?.priceMin && listing?.priceMax ? 'range' : 'fixed') as 'fixed' | 'range',
    minPrice: listing?.priceMin?.toString() || '',
    maxPrice: listing?.priceMax?.toString() || '',
    categoryId: listing?.categoryId?.toString() || '',
    location: listing?.location || '',
    contactName: listing?.contactName || session?.user?.name || '',
    contactPhone: listing?.contactPhone || '',
    guestEmail: '',
    status: listing?.status || 'ACTIVE',
  })

  const [images, setImages] = useState<string[]>(
    listing?.images.map(img => img.url) || []
  )

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Format number with thousand separators for display
  const formatPrice = (value: string) => {
    if (!value) return ''
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // Remove formatting for storage
  const unformatPrice = (value: string) => {
    return value.replace(/,/g, '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // For price fields, only allow numbers
    if (name === 'price' || name === 'minPrice' || name === 'maxPrice') {
      // Remove all non-digit characters (including commas from formatting)
      const numericValue = value.replace(/[^0-9]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Minimal validation - only check if at least title is provided
    if (!formData.title.trim()) {
      setError('Vui lòng nhập ít nhất tiêu đề')
      return
    }

    // Calculate final price and price range based on price type
    let finalPrice = '0'
    let priceMin = ''
    let priceMax = ''

    if (formData.priceType === 'fixed' && formData.price) {
      finalPrice = formData.price
    } else if (formData.priceType === 'range') {
      if (formData.minPrice && formData.maxPrice) {
        // Validate range
        const min = parseFloat(formData.minPrice)
        const max = parseFloat(formData.maxPrice)

        if (min > max) {
          setError('Giá tối thiểu không thể lớn hơn giá tối đa')
          return
        }

        // Store min and max separately
        priceMin = formData.minPrice
        priceMax = formData.maxPrice
        // Store average as main price for sorting/filtering
        const avg = (min + max) / 2
        finalPrice = avg.toString()
      }
    }

    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('price', finalPrice)
    if (priceMin) data.append('priceMin', priceMin)
    if (priceMax) data.append('priceMax', priceMax)
    data.append('categoryId', formData.categoryId)
    data.append('location', formData.location)
    data.append('contactName', formData.contactName)
    data.append('contactPhone', formData.contactPhone)
    data.append('guestEmail', formData.guestEmail)
    data.append('imageUrls', JSON.stringify(images))
    if (listing) {
      data.append('status', formData.status)
    }

    startTransition(async () => {
      const result = listing
        ? await updateListing(listing.id, data)
        : await createListing(data)

      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push(listing ? `/listings/${result.listing.slug}` : '/')
          router.refresh()
        }, 1500)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✅ {listing ? 'Cập nhật tin thành công!' : 'Đăng tin thành công!'} Đang chuyển hướng...
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Thông tin cơ bản</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="VD: iPhone 14 Pro Max 256GB còn mới 99%"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Mô tả chi tiết về sản phẩm/dịch vụ của bạn..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Price Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Giá (VNĐ)
          </label>

          {/* Price Type Selection */}
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="priceType"
                value="fixed"
                checked={formData.priceType === 'fixed'}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-gray-700">Giá cố định</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="priceType"
                value="range"
                checked={formData.priceType === 'range'}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-gray-700">Khoảng giá</span>
            </label>
          </div>

          {/* Price Input(s) */}
          {formData.priceType === 'fixed' ? (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9,]*"
              name="price"
              value={formatPrice(formData.price)}
              onChange={handleChange}
              placeholder="Nhập giá (VNĐ)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              onKeyPress={(e) => {
                // Prevent non-numeric characters
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault()
                }
              }}
            />
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                name="minPrice"
                value={formatPrice(formData.minPrice)}
                onChange={handleChange}
                placeholder="Từ (VNĐ)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
              />
              <span className="text-gray-500 font-medium">đến</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                name="maxPrice"
                value={formatPrice(formData.maxPrice)}
                onChange={handleChange}
                placeholder="Đến (VNĐ)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          >
            <option value="">Chọn danh mục</option>
            {categories.map(parent => (
              <optgroup key={parent.id} label={`${parent.icon} ${parent.name}`}>
                {parent.children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.icon} {child.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa điểm
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="VD: Quận 1, TP.HCM hoặc Sa Đéc, Đồng Tháp"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>

        {listing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            >
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="SOLD">Đã bán</option>
              <option value="HIDDEN">Ẩn</option>
            </select>
          </div>
        )}
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">
          Hình ảnh
        </h2>
        <ImageUpload images={images} onChange={setImages} />
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Thông tin liên hệ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên người liên hệ
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Tên của bạn"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="0912345678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {!session && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (để nhận thông báo)
            </label>
            <input
              type="email"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <p className="mt-2 text-sm text-gray-600">
              💡 Đăng nhập để quản lý tin đăng của bạn dễ dàng hơn!
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-4 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Đang xử lý...' : listing ? 'Cập nhật tin' : 'Đăng tin'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  )
}
