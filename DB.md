# Tài Liệu Thiết Kế Database - Wedosa

## 1. Tổng Quan Database

**Database Engine:** MySQL 8.0+
**ORM:** Prisma
**Character Set:** utf8mb4 (hỗ trợ Unicode đầy đủ, bao gồm emoji)
**Collation:** utf8mb4_unicode_ci

## 2. Entity Relationship Diagram (ERD)

```
┌─────────────────┐         ┌──────────────────┐
│     users       │         │      books       │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ username        │         │ title            │
│ password        │         │ slug (UNIQUE)    │
│ email           │         │ author           │
│ role            │         │ description      │
│ createdAt       │         │ coverImage       │
│ updatedAt       │         │ status           │
└─────────────────┘         │ genre            │
                            │ createdAt        │
                            │ updatedAt        │
                            └────────┬─────────┘
                                     │
                                     │ 1:N
                                     │
                            ┌────────▼─────────┐
                            │    chapters      │
                            ├──────────────────┤
                            │ id (PK)          │
                            │ bookId (FK)      │
                            │ chapterNumber    │
                            │ title            │
                            │ slug             │
                            │ content (TEXT)   │
                            │ createdAt        │
                            │ updatedAt        │
                            └──────────────────┘
```

## 3. Database Schema Chi Tiết

### 3.1. Table: `users`

Lưu trữ thông tin admin và user (future).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Tên đăng nhập |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Email |
| password | VARCHAR(255) | NOT NULL | Password đã hash (bcrypt) |
| role | ENUM('ADMIN', 'USER') | NOT NULL, DEFAULT 'USER' | Vai trò |
| createdAt | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updatedAt | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE KEY: `username`
- UNIQUE KEY: `email`
- INDEX: `role` (cho query theo role)

**Sample Data:**
```sql
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@wedosa.com', '$2a$10$...hashed...', 'ADMIN');
```

---

### 3.2. Table: `books`

Lưu trữ thông tin sách.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất |
| title | VARCHAR(255) | NOT NULL | Tiêu đề sách |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly slug |
| author | VARCHAR(100) | NOT NULL | Tác giả |
| description | TEXT | NULL | Mô tả sách |
| coverImage | VARCHAR(500) | NULL | URL ảnh bìa |
| status | ENUM('ONGOING', 'COMPLETED') | NOT NULL, DEFAULT 'ONGOING' | Trạng thái |
| genre | VARCHAR(100) | NULL | Thể loại |
| createdAt | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updatedAt | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE KEY: `slug` (cho SEO-friendly URLs)
- INDEX: `status` (filter by status)
- INDEX: `genre` (filter by genre)
- INDEX: `createdAt` (sort by date)

**Sample Data:**
```sql
INSERT INTO books (title, slug, author, description, status, genre) VALUES
('Lập Trình Web Cơ Bản', 'lap-trinh-web-co-ban', 'Nguyễn Văn A', 'Khóa học lập trình web từ cơ bản đến nâng cao', 'ONGOING', 'Programming'),
('Truyện Kiếm Hiệp', 'truyen-kiem-hiep', 'Kim Dung', 'Truyện kiếm hiệp hay nhất mọi thời đại', 'COMPLETED', 'Fiction');
```

---

### 3.3. Table: `chapters`

Lưu trữ các chương của sách.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất |
| bookId | INT | FOREIGN KEY (books.id), NOT NULL | ID sách |
| chapterNumber | INT | NOT NULL | Số thứ tự chương |
| title | VARCHAR(255) | NOT NULL | Tiêu đề chương |
| slug | VARCHAR(255) | NOT NULL | URL-friendly slug |
| content | LONGTEXT | NOT NULL | Nội dung Markdown |
| createdAt | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updatedAt | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Constraints:**
- FOREIGN KEY: `bookId` REFERENCES `books(id)` ON DELETE CASCADE
- UNIQUE KEY: `bookId + chapterNumber` (không trùng số chương trong cùng sách)
- UNIQUE KEY: `bookId + slug` (slug unique trong phạm vi sách)

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `bookId` (query chapters by book)
- UNIQUE INDEX: `bookId, chapterNumber` (ensure unique chapter number per book)
- UNIQUE INDEX: `bookId, slug` (ensure unique slug per book)
- INDEX: `chapterNumber` (sort chapters)

**Sample Data:**
```sql
INSERT INTO chapters (bookId, chapterNumber, title, slug, content) VALUES
(1, 1, 'Giới thiệu HTML', 'gioi-thieu-html', '# Chương 1: Giới thiệu HTML\n\nHTML là ngôn ngữ...'),
(1, 2, 'CSS Cơ bản', 'css-co-ban', '# Chương 2: CSS Cơ bản\n\nCSS dùng để...'),
(2, 1, 'Khởi đầu hành trình', 'khoi-dau-hanh-trinh', '# Chương 1\n\nNgày xửa ngày xưa...');
```

---

## 4. Relationships

### 4.1. books → chapters (One-to-Many)

- Một sách có nhiều chương
- Một chương thuộc về một sách
- Khi xóa sách, tất cả chương liên quan cũng bị xóa (CASCADE)

```sql
ALTER TABLE chapters
ADD CONSTRAINT fk_chapters_books
FOREIGN KEY (bookId) REFERENCES books(id)
ON DELETE CASCADE
ON UPDATE CASCADE;
```

### 4.2. Future Relationships (Phase 2)

- `users` → `bookmarks` (One-to-Many)
- `users` → `reading_progress` (One-to-Many)
- `users` → `comments` (One-to-Many)

## 5. Prisma Schema

File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique @db.VarChar(50)
  email     String   @unique @db.VarChar(100)
  password  String   @db.VarChar(255)
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([role])
  @@map("users")
}

model Book {
  id          Int         @id @default(autoincrement())
  title       String      @db.VarChar(255)
  slug        String      @unique @db.VarChar(255)
  author      String      @db.VarChar(100)
  description String?     @db.Text
  coverImage  String?     @db.VarChar(500)
  status      BookStatus  @default(ONGOING)
  genre       String?     @db.VarChar(100)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  chapters    Chapter[]

  @@index([status])
  @@index([genre])
  @@index([createdAt])
  @@map("books")
}

model Chapter {
  id            Int      @id @default(autoincrement())
  bookId        Int
  chapterNumber Int
  title         String   @db.VarChar(255)
  slug          String   @db.VarChar(255)
  content       String   @db.LongText
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  book          Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)

  @@unique([bookId, chapterNumber])
  @@unique([bookId, slug])
  @@index([bookId])
  @@index([chapterNumber])
  @@map("chapters")
}

enum Role {
  ADMIN
  USER
}

enum BookStatus {
  ONGOING
  COMPLETED
}
```

## 6. Sample SQL Queries

### 6.1. Lấy tất cả sách với số lượng chương

```sql
SELECT
  b.id,
  b.title,
  b.author,
  b.coverImage,
  b.status,
  COUNT(c.id) as chapterCount
FROM books b
LEFT JOIN chapters c ON b.id = c.bookId
GROUP BY b.id
ORDER BY b.createdAt DESC;
```

**Prisma equivalent:**
```typescript
await db.book.findMany({
  include: {
    _count: {
      select: { chapters: true }
    }
  },
  orderBy: { createdAt: 'desc' }
})
```

### 6.2. Lấy chi tiết sách với danh sách chương

```sql
SELECT
  b.*,
  c.id as chapter_id,
  c.chapterNumber,
  c.title as chapter_title,
  c.slug as chapter_slug
FROM books b
LEFT JOIN chapters c ON b.id = c.bookId
WHERE b.slug = 'lap-trinh-web-co-ban'
ORDER BY c.chapterNumber ASC;
```

**Prisma equivalent:**
```typescript
await db.book.findUnique({
  where: { slug: 'lap-trinh-web-co-ban' },
  include: {
    chapters: {
      orderBy: { chapterNumber: 'asc' },
      select: { id: true, chapterNumber: true, title: true, slug: true }
    }
  }
})
```

### 6.3. Lấy nội dung chương với thông tin sách

```sql
SELECT
  c.*,
  b.title as book_title,
  b.slug as book_slug,
  b.author as book_author
FROM chapters c
INNER JOIN books b ON c.bookId = b.id
WHERE b.slug = 'lap-trinh-web-co-ban'
  AND c.slug = 'gioi-thieu-html';
```

**Prisma equivalent:**
```typescript
await db.chapter.findFirst({
  where: {
    slug: 'gioi-thieu-html',
    book: { slug: 'lap-trinh-web-co-ban' }
  },
  include: {
    book: {
      select: { title: true, slug: true, author: true }
    }
  }
})
```

### 6.4. Lấy chương trước và chương sau

```sql
-- Chương hiện tại: bookId=1, chapterNumber=2

-- Chương trước
SELECT * FROM chapters
WHERE bookId = 1 AND chapterNumber < 2
ORDER BY chapterNumber DESC
LIMIT 1;

-- Chương sau
SELECT * FROM chapters
WHERE bookId = 1 AND chapterNumber > 2
ORDER BY chapterNumber ASC
LIMIT 1;
```

**Prisma equivalent:**
```typescript
const currentChapter = await db.chapter.findFirst({
  where: { bookId: 1, chapterNumber: 2 }
})

const prevChapter = await db.chapter.findFirst({
  where: {
    bookId: 1,
    chapterNumber: { lt: currentChapter.chapterNumber }
  },
  orderBy: { chapterNumber: 'desc' }
})

const nextChapter = await db.chapter.findFirst({
  where: {
    bookId: 1,
    chapterNumber: { gt: currentChapter.chapterNumber }
  },
  orderBy: { chapterNumber: 'asc' }
})
```

### 6.5. Tìm kiếm sách theo tiêu đề hoặc tác giả

```sql
SELECT * FROM books
WHERE title LIKE '%lập trình%' OR author LIKE '%Nguyễn%'
ORDER BY createdAt DESC;
```

**Prisma equivalent:**
```typescript
await db.book.findMany({
  where: {
    OR: [
      { title: { contains: 'lập trình' } },
      { author: { contains: 'Nguyễn' } }
    ]
  },
  orderBy: { createdAt: 'desc' }
})
```

### 6.6. Lấy sách theo thể loại

```sql
SELECT * FROM books
WHERE genre = 'Programming'
ORDER BY title ASC;
```

**Prisma equivalent:**
```typescript
await db.book.findMany({
  where: { genre: 'Programming' },
  orderBy: { title: 'asc' }
})
```

### 6.7. Thống kê số lượng sách theo trạng thái

```sql
SELECT
  status,
  COUNT(*) as count
FROM books
GROUP BY status;
```

**Prisma equivalent:**
```typescript
await db.book.groupBy({
  by: ['status'],
  _count: true
})
```

### 6.8. Lấy 10 sách mới nhất

```sql
SELECT * FROM books
ORDER BY createdAt DESC
LIMIT 10;
```

**Prisma equivalent:**
```typescript
await db.book.findMany({
  take: 10,
  orderBy: { createdAt: 'desc' }
})
```

## 7. Database Indexes Strategy

### 7.1. Primary Indexes
- Tất cả tables có `id` là PRIMARY KEY với AUTO_INCREMENT

### 7.2. Unique Indexes
- `users.username`: Đảm bảo username duy nhất
- `users.email`: Đảm bảo email duy nhất
- `books.slug`: Đảm bảo URL duy nhất
- `chapters(bookId, chapterNumber)`: Đảm bảo không trùng số chương trong sách
- `chapters(bookId, slug)`: Đảm bảo slug duy nhất trong phạm vi sách

### 7.3. Performance Indexes
- `users.role`: Tìm user theo role nhanh
- `books.status`: Lọc sách theo trạng thái
- `books.genre`: Lọc sách theo thể loại
- `books.createdAt`: Sắp xếp theo ngày tạo
- `chapters.bookId`: Query chapters của sách (FOREIGN KEY index)
- `chapters.chapterNumber`: Sắp xếp chương

### 7.4. Index Recommendations

**Khi nào cần thêm index:**
- Khi query chậm (sử dụng `EXPLAIN` để analyze)
- Khi filter/sort thường xuyên trên một column
- Khi JOIN trên column không có index

**Khi nào KHÔNG nên thêm index:**
- Table nhỏ (< 1000 rows)
- Column ít khi query
- Column có nhiều duplicate values (low cardinality)
- Write-heavy tables (index làm chậm INSERT/UPDATE)

## 8. Database Migrations

### 8.1. Initial Migration

```bash
# Tạo migration đầu tiên
npx prisma migrate dev --name init

# File tạo ra: prisma/migrations/20250127000000_init/migration.sql
```

**Migration file content:**
```sql
-- CreateEnum
CREATE TYPE `Role` AS ENUM ('ADMIN', 'USER');
CREATE TYPE `BookStatus` AS ENUM ('ONGOING', 'COMPLETED');

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `books` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `author` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `coverImage` VARCHAR(500) NULL,
    `status` ENUM('ONGOING', 'COMPLETED') NOT NULL DEFAULT 'ONGOING',
    `genre` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `books_slug_key`(`slug`),
    INDEX `books_status_idx`(`status`),
    INDEX `books_genre_idx`(`genre`),
    INDEX `books_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chapters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookId` INTEGER NOT NULL,
    `chapterNumber` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `chapters_bookId_chapterNumber_key`(`bookId`, `chapterNumber`),
    UNIQUE INDEX `chapters_bookId_slug_key`(`bookId`, `slug`),
    INDEX `chapters_bookId_idx`(`bookId`),
    INDEX `chapters_chapterNumber_idx`(`chapterNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_bookId_fkey`
FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
```

### 8.2. Adding New Column (Example)

```bash
# Modify prisma/schema.prisma, thêm column viewCount vào Book model
# Sau đó:
npx prisma migrate dev --name add_view_count
```

**Migration file:**
```sql
-- AlterTable
ALTER TABLE `books` ADD COLUMN `viewCount` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `books_viewCount_idx` ON `books`(`viewCount`);
```

### 8.3. Migration Best Practices

1. **Development:**
   - Use `npx prisma migrate dev`
   - Tạo descriptive migration names
   - Test migrations locally trước

2. **Production:**
   - Use `npx prisma migrate deploy`
   - Backup database trước khi migrate
   - Test trên staging environment trước
   - Schedule migrations during low-traffic hours

3. **Rollback Strategy:**
   - Prisma không có built-in rollback
   - Keep backups trước mỗi migration
   - Manual rollback bằng SQL nếu cần

## 9. Database Seeding

### 9.1. Seed File

File: `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@wedosa.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created:', admin.username)

  // Create sample book
  const book = await prisma.book.upsert({
    where: { slug: 'lap-trinh-web-co-ban' },
    update: {},
    create: {
      title: 'Lập Trình Web Cơ Bản',
      slug: 'lap-trinh-web-co-ban',
      author: 'Nguyễn Văn A',
      description: 'Khóa học lập trình web từ cơ bản đến nâng cao',
      status: 'ONGOING',
      genre: 'Programming'
    }
  })

  console.log('✅ Sample book created:', book.title)

  // Create sample chapters
  const chapters = [
    {
      bookId: book.id,
      chapterNumber: 1,
      title: 'Giới thiệu HTML',
      slug: 'gioi-thieu-html',
      content: '# Chương 1: Giới thiệu HTML\n\nHTML là ngôn ngữ đánh dấu siêu văn bản...'
    },
    {
      bookId: book.id,
      chapterNumber: 2,
      title: 'CSS Cơ bản',
      slug: 'css-co-ban',
      content: '# Chương 2: CSS Cơ bản\n\nCSS dùng để tạo style cho HTML...'
    },
    {
      bookId: book.id,
      chapterNumber: 3,
      title: 'JavaScript Cơ bản',
      slug: 'javascript-co-ban',
      content: '# Chương 3: JavaScript Cơ bản\n\nJavaScript là ngôn ngữ lập trình...'
    }
  ]

  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: {
        bookId_chapterNumber: {
          bookId: chapter.bookId,
          chapterNumber: chapter.chapterNumber
        }
      },
      update: {},
      create: chapter
    })
  }

  console.log('✅ Sample chapters created:', chapters.length)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 9.2. Configure package.json

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### 9.3. Run Seed

```bash
npx prisma db seed
```

## 10. Backup and Recovery Strategy

### 10.1. Backup Strategies

**1. Automated Daily Backups:**
```bash
# Cron job (Linux/Mac)
# Run daily at 2 AM
0 2 * * * mysqldump -u username -p'password' wedosa > /backups/wedosa_$(date +\%Y\%m\%d).sql
```

**2. Manual Backup:**
```bash
# Full backup
mysqldump -u username -p wedosa > wedosa_backup.sql

# Backup with compression
mysqldump -u username -p wedosa | gzip > wedosa_backup.sql.gz

# Backup specific tables
mysqldump -u username -p wedosa books chapters > books_backup.sql
```

**3. Cloud Backup (PlanetScale/AWS RDS):**
- Automated point-in-time recovery
- Retention: 7-30 days
- No manual backup needed

### 10.2. Recovery

**Restore from backup:**
```bash
# Full restore
mysql -u username -p wedosa < wedosa_backup.sql

# Restore from compressed
gunzip < wedosa_backup.sql.gz | mysql -u username -p wedosa
```

### 10.3. Backup Best Practices

- ✅ Automated daily backups
- ✅ Keep multiple backup versions (7 days rolling)
- ✅ Store backups off-site (S3, Google Cloud Storage)
- ✅ Test restore regularly
- ✅ Backup before major migrations
- ✅ Encrypt backup files

## 11. Database Performance Tuning

### 11.1. Connection Pooling

Prisma tự động quản lý connection pool:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  // Connection pool settings (optional)
  // Format: mysql://user:password@host:port/database?connection_limit=10
}
```

### 11.2. Query Optimization Tips

**❌ Bad:**
```typescript
// N+1 Query Problem
const books = await db.book.findMany()
for (const book of books) {
  const chapters = await db.chapter.findMany({ where: { bookId: book.id } })
}
```

**✅ Good:**
```typescript
// Single query with include
const books = await db.book.findMany({
  include: { chapters: true }
})
```

**✅ Better (select only needed fields):**
```typescript
const books = await db.book.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    chapters: {
      select: { id: true, title: true, chapterNumber: true }
    }
  }
})
```

### 11.3. Pagination

```typescript
// Cursor-based pagination (recommended for large datasets)
const chapters = await db.chapter.findMany({
  take: 20,
  skip: 1, // skip cursor
  cursor: { id: lastChapterId },
  where: { bookId: 1 },
  orderBy: { chapterNumber: 'asc' }
})

// Offset-based pagination (simpler, but slower for large offsets)
const books = await db.book.findMany({
  take: 10,
  skip: 20, // page 3 (20 = 2 * 10)
  orderBy: { createdAt: 'desc' }
})
```

### 11.4. Caching Strategy

```typescript
// React Cache (Next.js 15)
import { cache } from 'react'

export const getBooks = cache(async () => {
  return await db.book.findMany()
})

// Usage in Server Component
const books = await getBooks() // Cached within same request
```

### 11.5. EXPLAIN Query Analysis

```sql
EXPLAIN SELECT * FROM books WHERE genre = 'Programming';

-- Check if index is used:
-- type: "ref" (good) vs "ALL" (full table scan, bad)
-- key: shows which index is used
-- rows: estimated rows to scan (lower is better)
```

## 12. Database Security

### 12.1. Secure Connection String

```bash
# .env.local
DATABASE_URL="mysql://username:password@localhost:3306/wedosa?ssl=true"

# Production (SSL required)
DATABASE_URL="mysql://user:pass@db.example.com:3306/wedosa?sslmode=require&sslcert=/path/to/cert.pem"
```

### 12.2. SQL Injection Prevention

Prisma ORM automatically prevents SQL injection through parameterized queries.

**❌ Never do this:**
```typescript
// RAW QUERY - Vulnerable to SQL injection
const userInput = req.query.search
await db.$executeRaw`SELECT * FROM books WHERE title = ${userInput}` // DANGEROUS!
```

**✅ Always use Prisma methods:**
```typescript
const userInput = req.query.search
const books = await db.book.findMany({
  where: { title: { contains: userInput } } // SAFE - Prisma handles escaping
})
```

### 12.3. Least Privilege Principle

**Create separate database users:**

```sql
-- Admin user (full access)
CREATE USER 'wedosa_admin'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON wedosa.* TO 'wedosa_admin'@'localhost';

-- Application user (limited access)
CREATE USER 'wedosa_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON wedosa.* TO 'wedosa_app'@'localhost';

-- Read-only user (for analytics, reporting)
CREATE USER 'wedosa_readonly'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT ON wedosa.* TO 'wedosa_readonly'@'localhost';

FLUSH PRIVILEGES;
```

### 12.4. Encryption

- **Password:** bcrypt with salt rounds (10-12)
- **Sensitive Data:** Encrypt at application level before storing
- **Connection:** Use SSL/TLS for database connections

## 13. Database Monitoring

### 13.1. Key Metrics to Monitor

- **Connection count:** Ensure not exceeding pool limit
- **Query execution time:** Slow queries (> 1s)
- **Table size:** Monitor growth
- **Index usage:** Identify unused indexes
- **Error rate:** Connection errors, query errors

### 13.2. Monitoring Tools

- **MySQL Workbench:** Visual monitoring
- **Prisma Studio:** View and edit data
- **Performance Schema:** MySQL built-in monitoring
- **Third-party:** DataDog, New Relic, Prometheus

### 13.3. Prisma Logging

```typescript
// lib/db.ts
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})
```

## 14. Database Constraints Summary

| Constraint Type | Usage | Example |
|----------------|-------|---------|
| PRIMARY KEY | Unique identifier | `id INT PRIMARY KEY` |
| FOREIGN KEY | Relationship | `bookId` references `books(id)` |
| UNIQUE | Prevent duplicates | `slug VARCHAR(255) UNIQUE` |
| NOT NULL | Required field | `title VARCHAR(255) NOT NULL` |
| DEFAULT | Default value | `status ENUM(...) DEFAULT 'ONGOING'` |
| CHECK | Value validation | `chapterNumber > 0` (MySQL 8.0+) |
| CASCADE | Automatic delete | `ON DELETE CASCADE` |

## 15. Future Database Enhancements

### 15.1. Phase 2 Tables

**bookmarks:**
```prisma
model Bookmark {
  id        Int      @id @default(autoincrement())
  userId    Int
  bookId    Int
  chapterId Int?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  book      Book     @relation(fields: [bookId], references: [id])
  chapter   Chapter? @relation(fields: [chapterId], references: [id])

  @@unique([userId, bookId])
}
```

**reading_progress:**
```prisma
model ReadingProgress {
  id         Int      @id @default(autoincrement())
  userId     Int
  chapterId  Int
  percentage Int      @default(0) // 0-100
  updatedAt  DateTime @updatedAt

  user       User     @relation(fields: [userId], references: [id])
  chapter    Chapter  @relation(fields: [chapterId], references: [id])

  @@unique([userId, chapterId])
}
```

**comments:**
```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  userId    Int
  chapterId Int
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id])
  chapter   Chapter  @relation(fields: [chapterId], references: [id])

  @@index([chapterId])
  @@index([userId])
}
```

---

**Version:** 1.0
**Ngày tạo:** 2025-10-27
**Database:** MySQL 8.0+ | ORM: Prisma