'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { chapterSchema, type ChapterFormData, generateSlug } from '@/lib/validations'
import { createChapter, updateChapter } from '@/actions/chapter.actions'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface ChapterFormProps {
  initialData?: ChapterFormData & { id: number }
  mode: 'create' | 'edit'
  books: { id: number; title: string }[]
}

export default function ChapterForm({ initialData, mode, books }: ChapterFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [content, setContent] = useState(initialData?.content || '')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: initialData || {
      bookId: books[0]?.id || 0,
      chapterNumber: 1,
      title: '',
      slug: '',
      content: ''
    }
  })

  const title = watch('title')

  // Update content in form when MDEditor changes
  useEffect(() => {
    setValue('content', content)
  }, [content, setValue])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setValue('title', newTitle)

    // Auto-generate slug from title if in create mode
    if (mode === 'create') {
      const slug = generateSlug(newTitle)
      setValue('slug', slug)
    }
  }

  const onSubmit = async (data: ChapterFormData) => {
    setLoading(true)
    setError('')

    try {
      const result = mode === 'create'
        ? await createChapter(data)
        : await updateChapter(initialData!.id, data)

      if (result.success) {
        router.push('/admin/chapters')
        router.refresh()
      } else {
        setError(result.error || 'Có lỗi xảy ra')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Bạn cần tạo sách trước khi thêm chương</p>
        <Button onClick={() => router.push('/admin/books/new')}>
          Tạo sách mới
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Sách"
          {...register('bookId', { valueAsNumber: true })}
          error={errors.bookId?.message}
          options={books.map(book => ({
            value: book.id.toString(),
            label: book.title
          }))}
          required
          disabled={mode === 'edit'}
        />

        <Input
          label="Số thứ tự chương"
          type="number"
          {...register('chapterNumber', { valueAsNumber: true })}
          error={errors.chapterNumber?.message}
          min={1}
          required
        />

        <Input
          label="Tiêu đề chương"
          {...register('title')}
          onChange={handleTitleChange}
          error={errors.title?.message}
          required
        />

        <Input
          label="Slug (URL)"
          {...register('slug')}
          error={errors.slug?.message}
          placeholder="gioi-thieu-html"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nội dung chương (Markdown) <span className="text-red-500">*</span>
        </label>
        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            height={500}
            preview="live"
          />
        </div>
        {errors.content?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : mode === 'create' ? 'Tạo chương' : 'Cập nhật'}
        </Button>
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-500 hover:bg-gray-600"
        >
          Hủy
        </Button>
      </div>
    </form>
  )
}
