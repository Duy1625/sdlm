# 🔍 Hướng dẫn Debug Chat với Admin

## Vấn đề: Không thấy chat với Admin khi mở ô chat

### Bước 1: Kiểm tra Admin User

Chạy lệnh để kiểm tra xem đã có admin user chưa:

```bash
npm run admin:check
```

**Kết quả mong đợi:**
```
✅ Tìm thấy 1 admin user(s):
1. ID: 3
   Email: admin@wedosa.com
   Name: Administrator
```

**Nếu không có admin:** Tạo admin bằng lệnh:
```bash
npm run admin:create
```

Hoặc nâng cấp tài khoản hiện có:
```bash
npm run admin:set your@email.com
```

---

### Bước 2: Mở Console trong Browser

1. Mở website và đăng nhập
2. Bấm `F12` để mở DevTools
3. Chuyển sang tab **Console**
4. Click vào icon chat ở góc phải

**Xem log để debug:**

✅ **Log bình thường (có admin support):**
```
📦 Fetched conversations: 1
✅ Support conversation found: { id: 1, isSupport: true, ... }
Admin user found: Administrator (admin@wedosa.com)
Created new support conversation: 1
```

❌ **Log lỗi (không có admin support):**
```
📦 Fetched conversations: 0
⚠️ No support conversation in response
⚠️ No admin user found in database. Please create an admin user.
```

---

### Bước 3: Kiểm tra Network

1. Trong DevTools, chuyển sang tab **Network**
2. Click vào icon chat
3. Tìm request: `conversations`
4. Click vào request đó
5. Xem tab **Preview** hoặc **Response**

**Response mong đợi:**
```json
{
  "conversations": [
    {
      "id": 1,
      "isSupport": true,
      "otherUser": {
        "id": 3,
        "name": "Administrator",
        "email": "admin@wedosa.com"
      },
      "lastMessage": null,
      "unreadCount": 0
    }
  ]
}
```

---

### Bước 4: Restart Server

Sau khi tạo admin, **PHẢI restart server**:

```bash
# Dừng server (Ctrl+C)
# Sau đó chạy lại:
npm run dev
```

---

### Bước 5: Clear Cache & Reload

1. Bấm `Ctrl + Shift + R` (hard reload)
2. Hoặc xóa cache:
   - Chrome: `Settings` → `Privacy and security` → `Clear browsing data`
   - Chọn `Cached images and files`

---

## ✅ Checklist Debug

- [ ] Đã có admin user trong database (`npm run admin:check`)
- [ ] Đã restart server sau khi tạo admin
- [ ] Đã hard reload page (`Ctrl + Shift + R`)
- [ ] Console không có lỗi đỏ
- [ ] Network response có `isSupport: true`

---

## 🐛 Các Lỗi Thường Gặp

### Lỗi 1: "No admin user found in database"

**Nguyên nhân:** Chưa có admin user

**Giải pháp:** Chạy `npm run admin:create`

---

### Lỗi 2: Chat list trống hoàn toàn

**Nguyên nhân:**
- Chưa đăng nhập
- API lỗi
- Database không kết nối được

**Giải pháp:**
1. Kiểm tra đã đăng nhập chưa
2. Xem console log có lỗi không
3. Kiểm tra `.env.local` có `DATABASE_URL` đúng không

---

### Lỗi 3: Có conversations khác nhưng không có admin support

**Nguyên nhân:** Admin user bị xóa hoặc role bị thay đổi

**Giải pháp:**
```bash
# Kiểm tra admin
npm run admin:check

# Nếu không có, tạo mới
npm run admin:create
```

---

## 📞 Hỗ Trợ Thêm

Nếu vẫn không được, gửi thông tin sau:

1. Screenshot console log
2. Screenshot network response của `/api/messages/conversations`
3. Kết quả của lệnh `npm run admin:check`
4. Server log (terminal nơi chạy `npm run dev`)
