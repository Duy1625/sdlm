import { z } from 'zod'

// Validation schema for Book
export const bookSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(255, 'Tiêu đề quá dài'),
  slug: z.string().min(1, 'Slug không được để trống').max(255, 'Slug quá dài')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  author: z.string().min(1, 'Tác giả không được để trống').max(100, 'Tên tác giả quá dài'),
  description: z.string().optional(),
  coverImage: z.string().url('URL ảnh bìa không hợp lệ').optional().or(z.literal('')),
  status: z.enum(['ONGOING', 'COMPLETED'], {
    errorMap: () => ({ message: 'Trạng thái không hợp lệ' })
  }),
  genre: z.string().max(100, 'Thể loại quá dài').optional()
})

export type BookFormData = z.infer<typeof bookSchema>

// Validation schema for Chapter
export const chapterSchema = z.object({
  bookId: z.number().int().positive('Book ID không hợp lệ'),
  chapterNumber: z.number().int().positive('Số thứ tự chương phải là số dương'),
  title: z.string().min(1, 'Tiêu đề chương không được để trống').max(255, 'Tiêu đề quá dài'),
  slug: z.string().min(1, 'Slug không được để trống').max(255, 'Slug quá dài')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  content: z.string().min(1, 'Nội dung chương không được để trống')
})

export type ChapterFormData = z.infer<typeof chapterSchema>

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
}
