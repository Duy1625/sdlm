'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@prisma/client'

interface CategoryFilterProps {
  categories: Category[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedCategory === slug) {
      params.delete('category')
    } else {
      params.set('category', slug)
    }

    router.push(`/?${params.toString()}`)
  }

  const handleClearFilters = () => {
    router.push('/')
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Danh mục</h3>
        {selectedCategory && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.slug

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-primary text-white shadow-lg shadow-emerald-500/50'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-500 hover:shadow-lg'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
