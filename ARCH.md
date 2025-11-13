# Tài Liệu Kiến Trúc Kỹ Thuật - Wedosa

## 1. Tổng Quan Kiến Trúc

Wedosa được xây dựng dựa trên kiến trúc **Full-Stack Web Application** với Next.js 15, sử dụng **App Router** và **Server Components** để tối ưu hiệu năng.

### 1.1. Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  (Desktop, Tablet, Mobile)                              │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
                   ↓
┌─────────────────────────────────────────────────────────┐
│                Next.js 15 Application                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │          App Router (Server Components)          │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              API Routes (REST)                   │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Server Actions (Admin CRUD)              │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────┘
                   │ SQL Queries
                   ↓
┌─────────────────────────────────────────────────────────┐
│                  MySQL Database                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   books     │  │  chapters   │  │    users    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 2. Tech Stack

### 2.1. Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3
- **UI Components:** Headless UI (optional) hoặc Radix UI
- **Markdown Rendering:** react-markdown, remark-gfm
- **Markdown Editor:** react-simplemde-editor hoặc @uiw/react-md-editor
- **Form Handling:** React Hook Form + Zod validation
- **State Management:** React Context (cho auth), Server State (built-in Next.js)

### 2.2. Backend
- **Runtime:** Node.js 18+
- **Framework:** Next.js 15 (API Routes + Server Actions)
- **Database ORM:** Prisma ORM
- **Database:** MySQL 8.0+
- **Authentication:** NextAuth.js v5
- **File Upload:** uploadthing hoặc local storage
- **Validation:** Zod

### 2.3. Development Tools
- **Package Manager:** npm hoặc pnpm
- **Linting:** ESLint
- **Formatting:** Prettier
- **Type Checking:** TypeScript
- **Environment Variables:** .env.local

### 2.4. Deployment
- **Platform:** Vercel (recommended) hoặc VPS
- **Database Hosting:** PlanetScale, AWS RDS, hoặc local MySQL
- **CDN:** Vercel CDN (cho static assets)

## 3. Cấu Trúc Thư Mục

```
wedosa/
├── src/
│   ├── app/                          # App Router
│   │   ├── (public)/                 # Public routes group
│   │   │   ├── page.tsx              # Trang chủ (danh sách sách)
│   │   │   ├── books/
│   │   │   │   ├── [slug]/
│   │   │   │   │   ├── page.tsx      # Chi tiết sách
│   │   │   │   │   └── [chapterSlug]/
│   │   │   │   │       └── page.tsx  # Đọc chương
│   │   │   ├── about/
│   │   │   │   └── page.tsx          # Giới thiệu
│   │   │   ├── contact/
│   │   │   │   └── page.tsx          # Liên hệ
│   │   │   ├── terms/
│   │   │   │   └── page.tsx          # Điều khoản
│   │   │   └── privacy/
│   │   │       └── page.tsx          # Chính sách bảo mật
│   │   ├── (admin)/                  # Admin routes group
│   │   │   ├── layout.tsx            # Layout với auth check
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx          # Dashboard
│   │   │   │   ├── books/
│   │   │   │   │   ├── page.tsx      # Quản lý sách
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx  # Thêm sách
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx  # Sửa sách
│   │   │   │   └── chapters/
│   │   │   │       ├── page.tsx      # Quản lý chương
│   │   │   │       ├── new/
│   │   │   │       │   └── page.tsx  # Thêm chương
│   │   │   │       └── [id]/
│   │   │   │           └── edit/
│   │   │   │               └── page.tsx  # Sửa chương
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts      # NextAuth config
│   │   │   ├── books/
│   │   │   │   ├── route.ts          # GET all books
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET/DELETE book
│   │   │   └── chapters/
│   │   │       ├── route.ts          # GET chapters
│   │   │       └── [id]/
│   │   │           └── route.ts      # GET/DELETE chapter
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles + Tailwind
│   ├── components/                   # React components
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── books/                    # Book-related components
│   │   │   ├── BookCard.tsx
│   │   │   ├── BookList.tsx
│   │   │   ├── BookDetail.tsx
│   │   │   └── BookForm.tsx
│   │   ├── chapters/                 # Chapter-related components
│   │   │   ├── ChapterList.tsx
│   │   │   ├── ChapterNavigation.tsx
│   │   │   ├── ChapterContent.tsx
│   │   │   └── ChapterForm.tsx
│   │   ├── markdown/                 # Markdown components
│   │   │   ├── MarkdownEditor.tsx
│   │   │   └── MarkdownRenderer.tsx
│   │   └── admin/                    # Admin components
│   │       ├── AdminNav.tsx
│   │       └── DataTable.tsx
│   ├── lib/                          # Utilities & helpers
│   │   ├── db.ts                     # Database connection (Prisma client)
│   │   ├── auth.ts                   # Auth utilities
│   │   ├── validations.ts            # Zod schemas
│   │   └── utils.ts                  # Helper functions
│   ├── actions/                      # Server Actions
│   │   ├── book.actions.ts           # CRUD books
│   │   └── chapter.actions.ts        # CRUD chapters
│   ├── types/                        # TypeScript types
│   │   ├── book.ts
│   │   ├── chapter.ts
│   │   └── user.ts
│   └── middleware.ts                 # Next.js middleware (auth)
├── prisma/
│   ├── schema.prisma                 # Prisma schema
│   └── migrations/                   # Database migrations
├── public/                           # Static assets
│   ├── images/
│   └── uploads/                      # Uploaded book covers
├── .env.local                        # Environment variables
├── .env.example                      # Example env file
├── next.config.js                    # Next.js config
├── tailwind.config.js                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json
├── BA.md                             # Business Analysis doc
├── ARCH.md                           # Architecture doc (this file)
└── DB.md                             # Database doc
```

## 4. Kiến Trúc Chi Tiết

### 4.1. Frontend Architecture

#### 4.1.1. App Router Structure

Next.js 15 sử dụng **App Router** với **Server Components** by default:

- **Server Components:** Render trên server, không gửi JavaScript xuống client
  - Phù hợp: Hiển thị data, static content
  - VD: BookList, ChapterContent

- **Client Components:** Render trên client, có interactivity
  - Phù hợp: Forms, buttons, modals
  - VD: BookForm, ChapterForm, MarkdownEditor
  - Đánh dấu bằng `'use client'`

#### 4.1.2. Route Groups

- **(public):** Routes công khai, không cần authentication
- **(admin):** Routes admin, có middleware check authentication

#### 4.1.3. Data Fetching Strategy

**Server Components (Recommended):**
```typescript
// app/(public)/books/[slug]/page.tsx
import { db } from '@/lib/db'

export default async function BookDetailPage({ params }: { params: { slug: string } }) {
  // Fetch trực tiếp trong Server Component
  const book = await db.book.findUnique({
    where: { slug: params.slug },
    include: { chapters: true }
  })

  return <BookDetail book={book} />
}
```

**Client Components (khi cần interactivity):**
```typescript
'use client'

import { useEffect, useState } from 'react'

export function BookList() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetch('/api/books').then(res => res.json()).then(setBooks)
  }, [])

  return <div>{/* Render books */}</div>
}
```

### 4.2. Backend Architecture

#### 4.2.1. API Routes

API Routes được sử dụng cho:
- Fetch data từ client components
- External API access
- Webhooks

**Example:**
```typescript
// app/api/books/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const books = await db.book.findMany({
    include: { _count: { select: { chapters: true } } }
  })
  return NextResponse.json(books)
}
```

#### 4.2.2. Server Actions

Server Actions được sử dụng cho:
- Form submissions
- Data mutations (Create, Update, Delete)
- Server-side logic

**Example:**
```typescript
// src/actions/book.actions.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { bookSchema } from '@/lib/validations'

export async function createBook(formData: FormData) {
  // Validate
  const data = bookSchema.parse({
    title: formData.get('title'),
    author: formData.get('author'),
    // ...
  })

  // Create
  const book = await db.book.create({ data })

  // Revalidate cache
  revalidatePath('/admin/books')

  return { success: true, book }
}
```

#### 4.2.3. Database Layer (Prisma ORM)

Prisma cung cấp:
- Type-safe database queries
- Auto-generated TypeScript types
- Migration management
- Query builder

**Example:**
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### 4.3. Authentication Architecture

#### 4.3.1. NextAuth.js Setup

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' }
      },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { username: credentials?.username }
        })

        if (!user) return null

        const valid = await bcrypt.compare(
          credentials?.password || '',
          user.password
        )

        if (!valid) return null

        return { id: user.id, username: user.username, role: user.role }
      }
    })
  ],
  pages: {
    signIn: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role
      return session
    }
  }
})

export { handler as GET, handler as POST }
```

#### 4.3.2. Middleware Protection

```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === 'ADMIN'
  }
})

export const config = {
  matcher: ['/admin/:path*']
}
```

### 4.4. Component Architecture

#### 4.4.1. Component Hierarchy

```
App
├── Layout (Root)
│   ├── Header
│   │   └── Navigation
│   ├── Main Content
│   │   ├── Page Components
│   │   │   ├── BookList
│   │   │   │   └── BookCard
│   │   │   ├── BookDetail
│   │   │   │   ├── BookInfo
│   │   │   │   └── ChapterList
│   │   │   └── ChapterReader
│   │   │       ├── Breadcrumb
│   │   │       ├── ChapterContent (Markdown)
│   │   │       └── ChapterNavigation
│   │   └── Admin Pages
│   │       ├── BookForm
│   │       │   └── ImageUpload
│   │       └── ChapterForm
│   │           └── MarkdownEditor
│   └── Footer
└── Modals/Dialogs (Portal)
```

#### 4.4.2. Component Patterns

**Server Component Pattern:**
```typescript
// components/books/BookList.tsx
import { db } from '@/lib/db'
import BookCard from './BookCard'

export default async function BookList() {
  const books = await db.book.findMany()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
```

**Client Component Pattern:**
```typescript
// components/books/BookForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookSchema } from '@/lib/validations'
import { createBook } from '@/actions/book.actions'

export default function BookForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(bookSchema)
  })

  const onSubmit = async (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => formData.append(key, data[key]))
    await createBook(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

## 5. Data Flow

### 5.1. Public Page Flow

```
1. User requests page (e.g., /books/book-slug)
   ↓
2. Next.js Server Component executes
   ↓
3. Direct database query via Prisma
   ↓
4. Data fetched from MySQL
   ↓
5. Component renders with data on server
   ↓
6. HTML sent to client (no JavaScript for data fetching)
   ↓
7. Page displays instantly
```

### 5.2. Admin CRUD Flow

```
1. Admin fills form in Client Component
   ↓
2. Form submission triggers Server Action
   ↓
3. Server Action validates with Zod
   ↓
4. Server Action performs database operation via Prisma
   ↓
5. Database updated
   ↓
6. Server Action revalidates affected paths
   ↓
7. Next.js cache invalidated
   ↓
8. User redirected or shown success message
   ↓
9. Updated data automatically reflected on next render
```

### 5.3. Markdown Rendering Flow

```
1. Admin writes Markdown in MarkdownEditor (Client Component)
   ↓
2. Preview shown using react-markdown
   ↓
3. On save, Markdown string sent via Server Action
   ↓
4. Stored as plain text in database
   ↓
5. On reader page, Markdown fetched (Server Component)
   ↓
6. MarkdownRenderer component renders HTML
   ↓
7. Styled HTML displayed to user
```

## 6. Security Considerations

### 6.1. Authentication & Authorization

- **NextAuth.js:** Secure session management
- **Password Hashing:** bcrypt with salt rounds
- **Role-Based Access:** Middleware checks for ADMIN role
- **Session Timeout:** Configure in NextAuth options

### 6.2. Input Validation

- **Zod Schemas:** Validate all inputs on server
- **Server Actions:** All mutations validated before DB operations
- **File Uploads:** Validate file types and sizes

### 6.3. XSS Prevention

- **Markdown Sanitization:** Use `remark-gfm` và sanitize HTML output
- **React Default:** JSX automatically escapes content
- **CSP Headers:** Configure Content Security Policy

### 6.4. SQL Injection Prevention

- **Prisma ORM:** Parameterized queries by default
- **No Raw SQL:** Avoid raw queries unless necessary

### 6.5. CSRF Protection

- **NextAuth.js:** Built-in CSRF token handling
- **Server Actions:** CSRF protected by default in Next.js

### 6.6. Environment Variables

```
# .env.local
DATABASE_URL="mysql://user:password@localhost:3306/wedosa"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## 7. Performance Optimization

### 7.1. Server Components

- Giảm JavaScript bundle size
- Data fetching trên server, faster initial load
- Automatic code splitting

### 7.2. Caching Strategy

- **React Cache:** Cache database queries in Server Components
- **Next.js Route Cache:** Cache rendered pages
- **revalidatePath():** Invalidate cache khi data thay đổi
- **Database Indexing:** Index các cột thường query (slug, status)

### 7.3. Image Optimization

- **next/image:** Automatic image optimization
- **Lazy loading:** Load images on demand
- **Responsive images:** Serve appropriate sizes

### 7.4. Code Splitting

- **Dynamic Imports:** Import components on demand
- **Route-based splitting:** Automatic với App Router

### 7.5. Database Optimization

- **Connection Pooling:** Prisma manages connection pool
- **Efficient Queries:** Use `select` và `include` wisely
- **Pagination:** Limit results với `take` và `skip`

## 8. Error Handling

### 8.1. Server Component Errors

```typescript
// app/(public)/books/[slug]/page.tsx
import { notFound } from 'next/navigation'

export default async function BookDetailPage({ params }) {
  const book = await db.book.findUnique({ where: { slug: params.slug } })

  if (!book) {
    notFound() // Shows 404 page
  }

  return <BookDetail book={book} />
}
```

### 8.2. Server Action Errors

```typescript
// src/actions/book.actions.ts
'use server'

export async function createBook(formData: FormData) {
  try {
    const data = bookSchema.parse(/* ... */)
    const book = await db.book.create({ data })
    return { success: true, book }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: error.flatten() }
    }
    return { success: false, error: 'Something went wrong' }
  }
}
```

### 8.3. Error Boundaries

```typescript
// app/error.tsx
'use client'

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## 9. Testing Strategy

### 9.1. Unit Tests
- **Library:** Jest + React Testing Library
- **Coverage:** Components, utility functions, validations

### 9.2. Integration Tests
- **Library:** Playwright
- **Coverage:** User flows (đọc sách, admin CRUD)

### 9.3. E2E Tests
- **Library:** Playwright
- **Coverage:** Critical paths (tạo sách, thêm chương, đọc sách)

## 10. Deployment Architecture

### 10.1. Vercel Deployment (Recommended)

```
GitHub Repository
      ↓ (push to main)
Vercel Auto Deploy
      ↓
Production URL: wedosa.vercel.app
```

**Configuration:**
- Environment variables in Vercel dashboard
- Database connection to PlanetScale or external MySQL
- Automatic HTTPS
- CDN for static assets

### 10.2. VPS Deployment (Alternative)

```
VPS Server (Ubuntu)
├── MySQL Database (local or external)
├── Node.js + PM2 (process manager)
├── Nginx (reverse proxy)
└── SSL Certificate (Let's Encrypt)
```

**Steps:**
1. Build: `npm run build`
2. Start: `pm2 start npm --name wedosa -- start`
3. Nginx config: Proxy to `http://localhost:3000`
4. SSL: `certbot --nginx`

## 11. Monitoring & Logging

### 11.1. Logging
- **Development:** Console logs
- **Production:** Winston or Pino logger
- **Database Queries:** Prisma logging

### 11.2. Monitoring
- **Vercel Analytics:** Built-in (if using Vercel)
- **Error Tracking:** Sentry
- **Uptime Monitoring:** UptimeRobot

## 12. Scalability Considerations

### 12.1. Current Limitations
- Single server instance
- Database connection limit

### 12.2. Future Scaling Options
- **Database:** Read replicas, connection pooling
- **Caching:** Redis for sessions and frequently accessed data
- **CDN:** CloudFront or Cloudflare for static assets
- **Load Balancer:** Multiple Next.js instances behind load balancer

## 13. Development Workflow

### 13.1. Local Development

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed data (optional)
npx prisma db seed

# Run dev server
npm run dev
```

### 13.2. Database Migrations

```bash
# Create migration
npx prisma migrate dev --name add_book_table

# Apply migrations in production
npx prisma migrate deploy
```

### 13.3. Code Quality

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Format
npm run format
```

## 14. Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^5.0.0-beta",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "@uiw/react-md-editor": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "prisma": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0"
  }
}
```

## 15. API Endpoints Reference

### 15.1. Public API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Lấy danh sách tất cả sách |
| GET | `/api/books/[id]` | Lấy chi tiết sách |
| GET | `/api/chapters?bookId=[id]` | Lấy chương của sách |
| GET | `/api/chapters/[id]` | Lấy chi tiết chương |

### 15.2. Admin API (Protected)

Sử dụng **Server Actions** thay vì API routes:

| Action | Description |
|--------|-------------|
| `createBook()` | Tạo sách mới |
| `updateBook()` | Cập nhật sách |
| `deleteBook()` | Xóa sách |
| `createChapter()` | Tạo chương mới |
| `updateChapter()` | Cập nhật chương |
| `deleteChapter()` | Xóa chương |

## 16. Responsive Design Strategy

### 16.1. Breakpoints (Tailwind)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px'  // Extra large
    }
  }
}
```

### 16.2. Layout Patterns

- **Mobile First:** Design for mobile, enhance for larger screens
- **Grid Layout:** Responsive grid với Tailwind grid classes
- **Typography:** Responsive font sizes với Tailwind text utilities
- **Navigation:** Mobile hamburger menu, desktop horizontal menu

## 17. SEO Considerations

### 17.1. Metadata

```typescript
// app/(public)/books/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const book = await db.book.findUnique({ where: { slug: params.slug } })

  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description,
      images: [book.coverImage]
    }
  }
}
```

### 17.2. Sitemap

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const books = await db.book.findMany()

  return [
    { url: 'https://wedosa.com', lastModified: new Date() },
    ...books.map(book => ({
      url: `https://wedosa.com/books/${book.slug}`,
      lastModified: book.updatedAt
    }))
  ]
}
```

## 18. Internationalization (Future)

Để hỗ trợ đa ngôn ngữ trong tương lai:
- **next-intl:** Thư viện i18n cho Next.js App Router
- **Database:** Thêm `language` column
- **Routes:** `/en/books`, `/vi/books`

---

**Version:** 1.0
**Ngày tạo:** 2025-10-27
**Framework:** Next.js 15 + Tailwind CSS 3 + MySQL