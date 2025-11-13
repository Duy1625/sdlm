# 📝 GHI CHÚ DEPLOYMENT - WEDOSA

**Ngày:** 13/11/2025
**Status:** ✅ Website đã LIVE thành công!

---

## 🌐 THÔNG TIN WEBSITE

- **Production URL:** https://wedosa.vercel.app
- **Vercel Dashboard:** https://vercel.com/duys-projects-723339f4/wedosa
- **Chi phí hiện tại:** $0/tháng (Free tier)

---

## 🗄️ DATABASE (Supabase - PostgreSQL)

- **Dashboard:** https://supabase.com
- **Project:** SDLM
- **Database Host:** `db.klmffjmwabdtfgssnquk.supabase.co`
- **Connection Type:** Connection Pooling (Transaction Mode)
- **Port:** 6543 (Pooler) - KHÔNG DÙNG 5432
- **Connection String Pattern:**
  ```
  postgresql://postgres.klmffjmwabdtfgssnquk:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=15
  ```
- **⚠️ Quan trọng:** Password có ký tự đặc biệt phải encode: `@` → `%40`, `#` → `%23`
- **Free Tier:** 500MB storage

---

## 📸 IMAGE STORAGE (Cloudinary)

- **Dashboard:** https://cloudinary.com
- **Cloud Name:** dgjbnd5cv
- **Free Tier:** 25GB storage, 25GB bandwidth/tháng
- **Folders:**
  - `listings/images` - Ảnh sản phẩm
  - `listings/videos` - Video sản phẩm
  - `chat` - Ảnh/video trong chat

---

## 🔐 ENVIRONMENT VARIABLES (Vercel)

Đã cấu hình 10 biến:
1. `DATABASE_URL` - Supabase connection pooling (với pgbouncer=true)
2. `NEXTAUTH_URL` - https://wedosa.vercel.app
3. `NEXTAUTH_URL_INTERNAL` - https://wedosa.vercel.app
4. `NEXTAUTH_SECRET` - (đã generate)
5. `CLOUDINARY_CLOUD_NAME`
6. `CLOUDINARY_API_KEY`
7. `CLOUDINARY_API_SECRET`
8. `GOOGLE_CLIENT_ID`
9. `GOOGLE_CLIENT_SECRET`
10. `FACEBOOK_CLIENT_ID`
11. `FACEBOOK_CLIENT_SECRET`

---

## ✅ ĐÃ HOÀN THÀNH

- [x] Chuyển database MySQL → PostgreSQL (Supabase)
- [x] Setup Cloudinary cho image storage
- [x] Deploy lên Vercel thành công
- [x] Fix các lỗi build (ESLint, TypeScript, Prisma)
- [x] Cấu hình Connection Pooling với pgbouncer
- [x] Test health check API: `/api/health`
- [x] Website đã LIVE và hoạt động

---

## 📋 VIỆC CẦN LÀM TIẾP (Ưu tiên)

### 1. Tạo Admin User
```bash
cd "G:\Websites\wedosa"
npm run admin:create
```
Hoặc dùng script có sẵn để tạo user admin đầu tiên.

### 2. Seed Categories
```bash
npm run db:seed-categories
```
Tạo các danh mục sản phẩm mặc định.

### 3. Test Đầy Đủ Tính Năng
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập (Email/Password, Google, Facebook)
- [ ] Đăng tin mua/bán
- [ ] Upload ảnh sản phẩm (test Cloudinary)
- [ ] Chat giữa buyer-seller
- [ ] Admin panel

### 4. Setup Custom Domain (Tùy chọn)
Nếu muốn domain riêng thay vì `wedosa.vercel.app`:
- Mua domain
- Vào Vercel → Settings → Domains
- Add custom domain

### 5. Cấu hình OAuth (Nếu cần)
Hiện đang dùng Google & Facebook OAuth với credentials test.
Nếu deploy production thực sự, cần:
- Update Google OAuth redirect URLs
- Update Facebook OAuth redirect URLs
- Thêm domain `wedosa.vercel.app` vào authorized domains

---

## 🐛 TROUBLESHOOTING

### Nếu gặp lỗi "Application error":
1. Kiểm tra logs: `vercel logs https://wedosa.vercel.app`
2. Test health check: `https://wedosa.vercel.app/api/health`
3. Verify DATABASE_URL có `?pgbouncer=true`

### Nếu database connection failed:
- Đảm bảo dùng Connection Pooling (port 6543)
- Đảm bảo có `?pgbouncer=true` trong connection string
- Kiểm tra Supabase project còn active

### Nếu upload ảnh lỗi:
- Kiểm tra Cloudinary credentials trong Vercel env vars
- Verify Cloudinary account chưa vượt quota

---

## 📚 TÀI LIỆU THAM KHẢO

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## 🔧 LỆNH HỮU ÍCH

### Deploy
```bash
cd "G:\Websites\wedosa"
vercel --prod
```

### Xem logs
```bash
vercel logs https://wedosa.vercel.app
```

### Pull environment variables về local
```bash
vercel env pull .env.local
```

### Database operations
```bash
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio
npm run admin:create     # Create admin user
npm run db:seed-categories
```

---

## 💡 LƯU Ý QUAN TRỌNG

1. **Không commit file `.env.local`** - Đã có trong .gitignore
2. **Backup database định kỳ** từ Supabase Dashboard
3. **Monitor usage** của Cloudinary và Supabase để không vượt free tier
4. **Prisma + Supabase PHẢI dùng Connection Pooling** với `pgbouncer=true`
5. **Password có ký tự đặc biệt** phải URL encode trong connection string

---

**Cập nhật lần cuối:** 13/11/2025
**Next update:** Sau khi tạo admin user và test đầy đủ
