'use client'

import { deleteChapter } from '@/actions/chapter.actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteChapterButton({
  chapterId,
  chapterTitle
}: {
  chapterId: number
  chapterTitle: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa chương "${chapterTitle}"?`)) {
      return
    }

    setLoading(true)
    const result = await deleteChapter(chapterId)

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
