# 🔐 Hướng dẫn tạo tài khoản Admin

## Phương pháp 1: Tạo tài khoản admin mới (Khuyến nghị)

Tạo tài khoản admin mới với email/password:

```bash
npm run admin:create
```

**Thông tin đăng nhập mặc định:**
- 📧 Email: `admin@wedosa.com`
- 🔑 Mật khẩu: `admin123456`

> ⚠️ **Lưu ý:** Bạn có thể thay đổi email và mật khẩu trong file `scripts/create-admin-user.js` trước khi chạy lệnh.

---

## Phương pháp 2: Nâng cấp user hiện có thành admin

Nếu bạn đã có tài khoản (đăng ký bằng email, Google, hoặc Facebook), bạn có thể nâng cấp nó thành admin:

```bash
npm run admin:set your@email.com
```

Ví dụ:
```bash
npm run admin:set duynguyen@gmail.com
```

---

## Phương pháp 3: Cập nhật trực tiếp qua SQL

1. Mở MySQL/MariaDB client hoặc phpMyAdmin
2. Chạy lệnh SQL sau:

```sql
-- Xem danh sách users
SELECT id, email, name, role FROM users;

-- Cập nhật user thành admin (thay email của bạn)
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';

-- Kiểm tra
SELECT id, email, name, role FROM users WHERE role = 'ADMIN';
```

Hoặc sử dụng file SQL có sẵn:
```bash
# Mở file này và chỉnh sửa email
scripts/set-admin-role.sql
```

---

## 🌐 Đăng nhập

Sau khi tạo tài khoản admin, đăng nhập tại:
- Development: http://localhost:3000/login
- Production: https://yourdomain.com/login

---

## 📋 Quyền của Admin

Khi đăng nhập bằng tài khoản admin, bạn có thể:

✅ Xem tất cả tin đăng trên hệ thống
✅ Chỉnh sửa bất kỳ tin đăng nào
✅ Xóa tin đăng vi phạm
✅ Truy cập trang admin: `/admin/listings`
✅ Thấy nút "ADMIN ACTIONS" trên mọi tin đăng

---

## 🔒 Bảo mật

- **Đổi mật khẩu:** Sau khi đăng nhập lần đầu với tài khoản admin mặc định, hãy đổi mật khẩu ngay!
- **Không chia sẻ:** Không chia sẻ thông tin đăng nhập admin với người khác
- **Môi trường production:** Đổi mật khẩu mạnh hơn trước khi deploy lên production

---

## ❓ Xử lý sự cố

### Lỗi: "Cannot find module @prisma/client"
```bash
npm install
npx prisma generate
```

### Lỗi: "Cannot connect to database"
Kiểm tra file `.env.local` và đảm bảo `DATABASE_URL` đúng.

### Quên mật khẩu admin
Chạy lại lệnh `npm run admin:create` để reset mật khẩu về mặc định.

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Database đã được setup chưa
2. File `.env.local` có đúng không
3. Dependencies đã được cài đặt chưa (`npm install`)
