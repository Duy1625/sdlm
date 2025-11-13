'use server'

import { db } from '@/lib/db'
import { chapterSchema, type ChapterFormData } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type ActionResult = {
  success: boolean
  error?: string
  data?: any
}

// Check if user is admin
async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
}

// Get all chapters (with optional bookId filter)
export async function getAllChapters(bookId?: number): Promise<ActionResult> {
  try {
    const chapters = await db.chapter.findMany({
      where: bookId ? { bookId } : undefined,
      include: {
        book: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: [
        { bookId: 'asc' },
        { chapterNumber: 'asc' }
      ]
    })

    return { success: true, data: chapters }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get chapter by ID
export async function getChapterById(id: number): Promise<ActionResult> {
  try {
    const chapter = await db.chapter.findUnique({
      where: { id },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    })

    if (!chapter) {
      return { success: false, error: 'Không tìm thấy chương' }
    }

    return { success: true, data: chapter }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Create chapter
export async function createChapter(data: ChapterFormData): Promise<ActionResult> {
  try {
    await checkAdmin()

    // Validate data
    const validatedData = chapterSchema.parse(data)

    // Check if book exists
    const book = await db.book.findUnique({
      where: { id: validatedData.bookId }
    })

    if (!book) {
      return { success: false, error: 'Không tìm thấy sách' }
    }

    // Check if chapter number already exists for this book
    const existingChapter = await db.chapter.findUnique({
      where: {
        bookId_chapterNumber: {
          bookId: validatedData.bookId,
          chapterNumber: validatedData.chapterNumber
        }
      }
    })

    if (existingChapter) {
      return { success: false, error: 'Số thứ tự chương đã tồn tại trong sách này' }
    }

    // Check if slug already exists for this book
    const existingSlug = await db.chapter.findUnique({
      where: {
        bookId_slug: {
          bookId: validatedData.bookId,
          slug: validatedData.slug
        }
      }
    })

    if (existingSlug) {
      return { success: false, error: 'Slug chương đã tồn tại trong sách này' }
    }

    // Create chapter
    const chapter = await db.chapter.create({
      data: validatedData
    })

    revalidatePath('/admin/chapters')
    revalidatePath(`/books/${book.slug}`)

    return { success: true, data: chapter }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.errors[0]?.message || 'Dữ liệu không hợp lệ' }
    }
    return { success: false, error: error.message }
  }
}

// Update chapter
export async function updateChapter(id: number, data: ChapterFormData): Promise<ActionResult> {
  try {
    await checkAdmin()

    // Validate data
    const validatedData = chapterSchema.parse(data)

    // Check if chapter exists
    const existingChapter = await db.chapter.findUnique({
      where: { id },
      include: { book: true }
    })

    if (!existingChapter) {
      return { success: false, error: 'Không tìm thấy chương' }
    }

    // Check if chapter number is taken by another chapter in the same book
    if (validatedData.chapterNumber !== existingChapter.chapterNumber ||
        validatedData.bookId !== existingChapter.bookId) {
      const numberTaken = await db.chapter.findFirst({
        where: {
          bookId: validatedData.bookId,
          chapterNumber: validatedData.chapterNumber,
          id: { not: id }
        }
      })

      if (numberTaken) {
        return { success: false, error: 'Số thứ tự chương đã tồn tại trong sách này' }
      }
    }

    // Check if slug is taken by another chapter in the same book
    if (validatedData.slug !== existingChapter.slug ||
        validatedData.bookId !== existingChapter.bookId) {
      const slugTaken = await db.chapter.findFirst({
        where: {
          bookId: validatedData.bookId,
          slug: validatedData.slug,
          id: { not: id }
        }
      })

      if (slugTaken) {
        return { success: false, error: 'Slug chương đã tồn tại trong sách này' }
      }
    }

    // Update chapter
    const chapter = await db.chapter.update({
      where: { id },
      data: validatedData,
      include: { book: true }
    })

    revalidatePath('/admin/chapters')
    revalidatePath(`/books/${existingChapter.book.slug}`)
    revalidatePath(`/books/${chapter.book.slug}/${existingChapter.slug}`)
    revalidatePath(`/books/${chapter.book.slug}/${chapter.slug}`)

    return { success: true, data: chapter }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.errors[0]?.message || 'Dữ liệu không hợp lệ' }
    }
    return { success: false, error: error.message }
  }
}

// Delete chapter
export async function deleteChapter(id: number): Promise<ActionResult> {
  try {
    await checkAdmin()

    // Check if chapter exists
    const chapter = await db.chapter.findUnique({
      where: { id },
      include: { book: true }
    })

    if (!chapter) {
      return { success: false, error: 'Không tìm thấy chương' }
    }

    // Delete chapter
    await db.chapter.delete({
      where: { id }
    })

    revalidatePath('/admin/chapters')
    revalidatePath(`/books/${chapter.book.slug}`)

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
