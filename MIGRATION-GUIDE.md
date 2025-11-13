# Hướng dẫn chuyển đổi từ Wedosa sang SaDec Local Market

## ✅ Đã hoàn thành

### 1. Đổi tên và Metadata
- ✅ Đổi tên project trong `package.json`: `sadeclocalmarket`
- ✅ Cập nhật metadata trong `src/app/layout.tsx`
- ✅ Cập nhật homepage hero section với branding mới
- ✅ Đổi tên database: `sadeclocalmarket`

### 2. Database Schema Mới
Đã thiết kế lại hoàn toàn database với các models:

- **User**: Hỗ trợ OAuth (Google, Facebook) và credentials login
  - Thêm fields: name, phone, avatar, provider, providerId
  - Password giờ là nullable cho OAuth users

- **Category**: Danh mục phân cấp với parent/child
  - 10 danh mục chính (Điện tử, Bất động sản, Xe cộ, etc.)
  - 40 danh mục con
  - Mỗi category có icon/emoji

- **Listing**: Tin rao vặt (thay thế Book model)
  - Thông tin: title, description, price, location
  - Contact: contactName, contactPhone
  - userId nullable để hỗ trợ guest posting
  - status: ACTIVE, SOLD, EXPIRED, HIDDEN
  - isVerified: admin có thể verify

- **Image**: Nhiều ảnh cho mỗi listing
  - isPrimary để đánh dấu ảnh chính

- **Conversation & Message**: Hệ thống chat
  - Conversation giữa buyer và seller
  - Messages với read status

### 3. OAuth Authentication
- ✅ Thêm GoogleProvider và FacebookProvider vào NextAuth
- ✅ Tự động tạo user khi đăng nhập lần đầu qua OAuth
- ✅ Callback xử lý OAuth sign-in

**⚠️ BẠN CẦN THỰC HIỆN:**
1. Lấy Google OAuth credentials từ: https://console.cloud.google.com
   - Tạo OAuth 2.0 Client ID
   - Thêm redirect URI: `http://localhost:3000/api/auth/callback/google`

2. Lấy Facebook OAuth credentials từ: https://developers.facebook.com
   - Tạo Facebook App
   - Thêm redirect URI: `http://localhost:3000/api/auth/callback/facebook`

3. Cập nhật file `.env.local` với credentials thực:
```env
GOOGLE_CLIENT_ID="your-real-google-client-id"
GOOGLE_CLIENT_SECRET="your-real-google-client-secret"
FACEBOOK_CLIENT_ID="your-real-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-real-facebook-client-secret"
```

### 4. UI Components Mới
- ✅ `ListingCard`: Card hiển thị tin rao vặt
- ✅ `CategoryFilter`: Filter theo danh mục
- ✅ `SearchBar`: Tìm kiếm tin đăng
- ✅ Homepage: Hiển thị listings với search & filter

### 5. Database Setup
- ✅ Push Prisma schema lên database
- ✅ Seed 50 categories (10 parent + 40 children)

## 📋 Cần hoàn thành tiếp

### 1. Listing Actions (CRUD)
Tạo file `src/actions/listing.actions.ts`:
- `createListing()`: Đăng tin mới (guest & user)
- `updateListing()`: Cập nhật tin
- `deleteListing()`: Xóa tin
- `getListingBySlug()`: Lấy chi tiết tin

### 2. Trang đăng tin mới
Tạo `src/app/(public)/listings/new/page.tsx`:
- Form đăng tin với validation
- Upload nhiều ảnh
- Chọn danh mục
- Không cần đăng nhập (guest posting)
- Nếu đã đăng nhập, lưu userId

### 3. Trang chi tiết listing
Tạo `src/app/(public)/listings/[slug]/page.tsx`:
- Hiển thị ảnh gallery
- Thông tin chi tiết
- Thông tin liên hệ (SĐT)
- Nút chat với người bán

### 4. Trang quản lý listings
Tạo `src/app/(public)/my-listings/page.tsx`:
- Chỉ user đã đăng nhập mới truy cập được
- Hiển thị tất cả listings của user
- Edit/Delete listings
- Xem số lượt xem, tin nhắn

### 5. Hệ thống Chat
- Tạo `src/app/(public)/messages/page.tsx`: Inbox
- Tạo `src/app/(public)/messages/[conversationId]/page.tsx`: Chi tiết chat
- Real-time messaging (có thể dùng Pusher hoặc Socket.io)
- Hiển thị danh sách conversations
- Mark as read

### 6. Admin Area
Cập nhật admin để quản lý marketplace:
- Quản lý listings (verify, delete)
- Quản lý users
- Quản lý categories
- Dashboard với statistics

## 🚀 Chạy dự án

```bash
# Development
npm run dev

# Database
npm run db:push              # Push schema changes
npm run db:seed-categories   # Seed categories
npm run db:studio            # Open Prisma Studio

# Build
npm run build
npm start
```

## 📦 Cấu trúc thư mục mới

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Homepage (đã cập nhật)
│   │   ├── listings/
│   │   │   ├── new/                    # [CẦN TẠO] Đăng tin mới
│   │   │   └── [slug]/                 # [CẦN TẠO] Chi tiết listing
│   │   ├── my-listings/                # [CẦN TẠO] Quản lý tin của user
│   │   └── messages/                   # [CẦN TẠO] Chat/Messages
│   └── admin/                          # [CẦN CẬP NHẬT] Admin area
│
├── components/
│   ├── listings/
│   │   ├── ListingCard.tsx            # ✅ Done
│   │   ├── CategoryFilter.tsx         # ✅ Done
│   │   ├── SearchBar.tsx              # ✅ Done
│   │   ├── ListingForm.tsx            # [CẦN TẠO] Form đăng/sửa tin
│   │   └── ImageUpload.tsx            # [CẦN TẠO] Upload nhiều ảnh
│   └── messages/                       # [CẦN TẠO] Chat components
│
├── actions/
│   ├── listing.actions.ts              # [CẦN TẠO] CRUD listings
│   └── message.actions.ts              # [CẦN TẠO] Chat actions
│
└── lib/
    └── auth.ts                         # ✅ Updated with OAuth

prisma/
├── schema.prisma                       # ✅ New schema
└── seed-categories.ts                  # ✅ Category seeder
```

## 🔐 Security Notes

- Guest posts: Lưu email trong `guestEmail` field, không tạo user
- User posts: Lưu `userId`, user có thể quản lý tin của mình
- Admin verification: Admin có thể verify tin đáng tin cậy
- Rate limiting: Nên thêm rate limit cho guest posting

## 🎨 Branding

Tên mới: **SaDec Local Market**
- Màu chủ đạo: Emerald/Teal/Cyan gradient
- Slogan: "Mua bán dễ dàng"
- Focus: Chợ rao vặt địa phương

## 📝 Notes

- Database cũ (wedosa) đã bị xóa và thay thế bằng database mới (sadeclocalmarket)
- Tất cả dữ liệu cũ (books, chapters) đã bị mất
- Schema mới không tương thích với schema cũ
- Cần implement upload ảnh (có thể dùng Cloudinary hoặc local storage)

## 🤝 Next Steps

1. ✅ Cập nhật OAuth credentials trong `.env.local`
2. Tạo listing actions và form
3. Tạo các trang còn thiếu
4. Implement hệ thống chat
5. Test toàn bộ flow: đăng tin → xem → chat → mua bán
6. Deploy lên production

---

**Liên hệ**: Nếu cần hỗ trợ thêm, hãy cho tôi biết những tính năng nào bạn muốn ưu tiên phát triển trước!
