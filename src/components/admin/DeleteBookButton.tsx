'use client'

import { deleteBook } from '@/actions/book.actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteBookButton({
  bookId,
  bookTitle
}: {
  bookId: number
  bookTitle: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa sách "${bookTitle}"?\n\nTất cả chương của sách này cũng sẽ bị xóa!`)) {
      return
    }

    setLoading(true)
    const result = await deleteBook(bookId)

    if (result.success) {
      router.refresh()
    } else {
      alert(`Lỗi: ${result.error}`)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Đang xóa...' : 'Xóa'}
    </button>
  )
}
