'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookSchema, type BookFormData, generateSlug } from '@/lib/validations'
import { createBook, updateBook } from '@/actions/book.actions'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface BookFormProps {
  initialData?: BookFormData & { id: number }
  mode: 'create' | 'edit'
}

export default function BookForm({ initialData, mode }: BookFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      author: '',
      description: '',
      coverImage: '',
      status: 'ONGOING',
      genre: ''
    }
  })

  const title = watch('title')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setValue('title', newTitle)

    // Auto-generate slug from title if in create mode
    if (mode === 'create') {
      const slug = generateSlug(newTitle)
      setValue('slug', slug)
    }
  }

  const onSubmit = async (data: BookFormData) => {
    setLoading(true)
    setError('')

    try {
      const result = mode === 'create'
        ? await createBook(data)
        : await updateBook(initialData!.id, data)

      if (result.success) {
        router.push('/admin/books')
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Tiêu đề sách"
          {...register('title')}
          onChange={handleTitleChange}
          error={errors.title?.message}
          required
        />

        <Input
          label="Slug (URL)"
          {...register('slug')}
          error={errors.slug?.message}
          placeholder="lap-trinh-web-co-ban"
          required
        />

        <Input
          label="Tác giả"
          {...register('author')}
          error={errors.author?.message}
          required
        />

        <Input
          label="Thể loại"
          {...register('genre')}
          error={errors.genre?.message}
          placeholder="Programming, Fiction, etc."
        />

        <Select
          label="Trạng thái"
          {...register('status')}
          error={errors.status?.message}
          options={[
            { value: 'ONGOING', label: 'Đang viết' },
            { value: 'COMPLETED', label: 'Hoàn thành' }
          ]}
          required
        />

        <Input
          label="URL Ảnh bìa"
          {...register('coverImage')}
          error={errors.coverImage?.message}
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      <Textarea
        label="Mô tả"
        {...register('description')}
        error={errors.description?.message}
        rows={5}
        placeholder="Mô tả ngắn về sách..."
      />

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : mode === 'create' ? 'Tạo sách' : 'Cập nhật'}
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
