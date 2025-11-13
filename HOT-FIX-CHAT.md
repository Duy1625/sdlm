# 🚨 HOT FIX: Chat API Error 500

## Vấn đề
API `/api/messages/conversations` bị lỗi 500 (Internal Server Error)

## Cách sửa nhanh

### Bước 1: Xem Server Log
Mở terminal nơi đang chạy `npm run dev` và tìm lỗi màu đỏ. Có thể là:
- Database connection error
- Prisma query error
- Missing admin user

### Bước 2: Kiểm tra Database
```bash
npm run admin:check
```

Nếu lỗi, có thể database chưa được setup đúng.

### Bước 3: Test API trực tiếp
Mở browser và vào: http://localhost:3000/api/messages/conversations

Xem response lỗi chi tiết.

---

## Copy server log từ terminal và gửi cho tôi
Terminal sẽ hiển thị lỗi chi tiết như:
- PrismaClientKnownRequestError
- Database connection failed
- v.v.
