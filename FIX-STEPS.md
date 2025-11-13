# 🔧 Các bước sửa lỗi Chat (PHẢI LÀM THEO THỨ TỰ)

## ✅ Đã hoàn thành:
- [x] Sửa schema: `listingId` giờ là nullable
- [x] Sync database

## 🚀 Bạn cần làm:

### Bước 1: STOP server
Trong terminal đang chạy `npm run dev`:
- Bấm **Ctrl + C** để dừng server

### Bước 2: Generate Prisma Client
```bash
npx prisma generate
```

### Bước 3: Restart server
```bash
npm run dev
```

### Bước 4: Hard Reload trang web
- Bấm **Ctrl + Shift + R**
- Hoặc **F5** vài lần

### Bước 5: Test
1. Mở chat widget (icon góc phải)
2. Xem console log (F12)
3. Phải thấy "✅ Support conversation found"

---

## ❓ Nếu vẫn lỗi

Copy toàn bộ server log (terminal) và gửi lại cho tôi.
