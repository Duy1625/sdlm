# Database Setup - Wedosa

## Thông Tin Database

- **Database Name:** wedosa
- **MySQL Version:** 8.0+
- **Character Set:** utf8mb4
- **Collation:** utf8mb4_unicode_ci

## Cấu Trúc Database

### Tables

1. **users** - Quản lý người dùng và admin
2. **books** - Lưu trữ thông tin sách
3. **chapters** - Lưu trữ các chương của sách

### Relationships

- `chapters.bookId` → `books.id` (Foreign Key, CASCADE on DELETE)

## Setup Đã Hoàn Thành

✅ Database `wedosa` đã được tạo
✅ 3 tables (users, books, chapters) đã được tạo với đầy đủ constraints và indexes
✅ Sample data đã được insert:
   - 1 admin user
   - 3 sách mẫu
   - 6 chương mẫu

## Thông Tin Admin Mặc Định

```
Username: admin
Email: admin@wedosa.com
Password: admin123
```

**LƯU Ý:** Password hash trong database hiện tại là placeholder. Bạn cần update lại với bcrypt hash thực khi implement authentication.

## Sample Data

### Books (3)
1. **Lập Trình Web Cơ Bản** - Programming (ONGOING)
   - Chương 1: Giới thiệu HTML
   - Chương 2: CSS Cơ bản
   - Chương 3: JavaScript Cơ bản

2. **Truyện Kiếm Hiệp** - Fiction (COMPLETED)
   - Chương 1: Khởi đầu hành trình
   - Chương 2: Gặp gỡ sư phụ

3. **Học Next.js 15** - Programming (ONGOING)
   - Chương 1: Giới thiệu Next.js 15

## Verify Database

### Kiểm tra tables
```sql
USE wedosa;
SHOW TABLES;
```

### Xem dữ liệu
```sql
-- Xem tất cả sách
SELECT * FROM books;

-- Xem sách với số lượng chương
SELECT
    b.id,
    b.title,
    b.author,
    b.status,
    COUNT(c.id) as chapterCount
FROM books b
LEFT JOIN chapters c ON b.id = c.bookId
GROUP BY b.id;

-- Xem chi tiết một sách với danh sách chương
SELECT
    b.title as book_title,
    c.chapterNumber,
    c.title as chapter_title
FROM books b
LEFT JOIN chapters c ON b.id = c.bookId
WHERE b.slug = 'lap-trinh-web-co-ban'
ORDER BY c.chapterNumber;
```

## Kết Nối Từ Ứng Dụng

### Environment Variables

Tạo file `.env.local`:

```env
DATABASE_URL="mysql://root:123456@localhost:3306/wedosa"
```

### Prisma Setup

1. Install Prisma:
```bash
npm install @prisma/client
npm install -D prisma
```

2. Init Prisma (nếu chưa có):
```bash
npx prisma init
```

3. Copy Prisma schema từ DB.md vào `prisma/schema.prisma`

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Introspect database (để verify):
```bash
npx prisma db pull
```

## Backup Database

### Backup toàn bộ database
```bash
mysqldump -u root -p123456 wedosa > backup_wedosa.sql
```

### Restore từ backup
```bash
mysql -u root -p123456 wedosa < backup_wedosa.sql
```

## Reset Database

Nếu muốn reset lại database từ đầu:

```bash
mysql -u root -p123456 < setup-database.sql
```

## Indexes

### users
- PRIMARY KEY: id
- UNIQUE: username, email
- INDEX: role

### books
- PRIMARY KEY: id
- UNIQUE: slug
- INDEX: status, genre, createdAt

### chapters
- PRIMARY KEY: id
- INDEX: bookId, chapterNumber
- UNIQUE: (bookId, chapterNumber), (bookId, slug)
- FOREIGN KEY: bookId → books(id) ON DELETE CASCADE

## Next Steps

1. ✅ Database đã sẵn sàng
2. 📝 Implement Prisma ORM trong Next.js
3. 📝 Tạo API Routes và Server Actions
4. 📝 Build frontend components
5. 📝 Implement authentication với NextAuth.js
6. 📝 Update admin password với bcrypt hash thực

## Troubleshooting

### Lỗi kết nối MySQL
```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p123456 -e "SELECT VERSION();"
```

### Xem thông tin charset
```sql
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';
```

### Check foreign keys
```sql
SELECT
    CONSTRAINT_NAME,
    TABLE_NAME,
    REFERENCED_TABLE_NAME,
    DELETE_RULE,
    UPDATE_RULE
FROM information_schema.REFERENTIAL_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'wedosa';
```

---

**Created:** 2025-10-27
**Status:** ✅ Ready for Development