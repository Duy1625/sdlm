'use server'

import { db } from '@/lib/db'
import { bookSchema, type BookFormData } from '@/lib/validations'
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

// Get all books
export async function getAllBooks(): Promise<ActionResult> {
  try {
    const books = await db.book.findMany({
      include: {
        _count: {
          select: { chapters: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: books }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get book by ID
export async function getBookById(id: number): Promise<ActionResult> {
  try {
    const book = await db.book.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' }
        }
      }
    })

    if (!book) {
      return { success: false, error: 'Không tìm thấy sách' }
    }

    return { success: true, data: book }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Create book
export async function createBook(data: BookFormData): Promise<ActionResult> {
  try {
    await checkAdmin()

    // Validate data
    const validatedData = bookSchema.parse(data)

    // Check if slug already exists
    const existingBook = await db.book.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingBook) {
      return { success: false, error: 'Slug đã tồn tại, vui lòng chọn slug khác' }
    }

    // Create book
    const book = await db.book.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        author: validatedData.author,
        description: validatedData.description || null,
        coverImage: validatedData.coverImage || null,
        status: validatedData.status,
        genre: validatedData.genre || null
      }
    })

    revalidatePath('/admin/books')
    revalidatePath('/')

    return { success: true, data: book }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.errors[0]?.message || 'Dữ liệu không hợp lệ' }
    }
    return { success: false, error: error.message }
  }
}

// Update book
export async function updateBook(id: number, data: BookFormData): Promise<ActionResult> {
  try {
    await checkAdmin()

    // Validate data
    const validatedData = bookSchema.parse(data)

    // Check if book exists
    const existingBook = await db.book.findUnique({
      where: { id }
    })

    if (!existingBook) {
      return { success: false, error: 'Không tìm thấy sách' }
    }

    // Check if slug is taken by another book
    if (validatedData.slug !== existingBook.slug) {
      const slugTaken = await db.book.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: id }
        }
      })

      if (slugTaken) {
        return { success: false, error: 'Slug đã tồn tại, vui lòng chọn slug khác' }
      }
    }

    // Update book
    const book = await db.book.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        author: validatedData.author,
        description: validatedData.description || null,
        coverImage: validatedData.coverImage || null,
        status: validatedData.status,
        genre: validatedData.genre || null
      }
    })

    revalidatePath('/admin/books')
    revalidatePath(`/books/${existingBook.slug}`)
    revalidatePath(`/books/${book.slug}`)
    revalidatePath('/')

    return { success: true, data: book }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.errors[0]?.message || 'Dữ liệu không hợp lệ' }
    }
    return { success: false, error: error.message }
  }
}

// Delete book
export async function deleteBook(id: number): Promise<ActionResult> {
  try {
    await checkAdmin()

    // Check if book exists
    const book = await db.book.findUnique({
      where: { id }
    })

    if (!book) {
      return { success: false, error: 'Không tìm thấy sách' }
    }

    // Delete book (chapters will be deleted automatically due to CASCADE)
    await db.book.delete({
      where: { id }
    })

    revalidatePath('/admin/books')
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
