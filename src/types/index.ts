import { Book, Chapter, User, BookStatus, Role } from '@prisma/client'

export type { Book, Chapter, User, BookStatus, Role }

export type BookWithChapters = Book & {
  chapters: Chapter[]
  _count?: {
    chapters: number
  }
}

export type ChapterWithBook = Chapter & {
  book: {
    id: number
    title: string
    slug: string
    author: string
  }
}

export type BookWithChapterCount = Book & {
  _count: {
    chapters: number
  }
}
