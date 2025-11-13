# Hướng dẫn Upload File

Hệ thống upload file đã được cấu hình để lưu trữ **trực tiếp trên server local** của bạn.

## Cấu trúc thư mục

```
public/
  └── uploads/
      ├── images/     # Lưu hình ảnh
      └── videos/     # Lưu video
```

## Tính năng

✅ Upload trực tiếp lên server local
✅ Không cần dịch vụ bên thứ 3
✅ Giới hạn: 6 hình ảnh + 2 video/bài đăng
✅ Kích thước: Ảnh tối đa 10MB, Video tối đa 100MB
✅ Hỗ trợ: JPG, PNG, GIF, MP4, MOV, AVI

## Cách hoạt động

1. Người dùng chọn file từ máy tính/điện thoại
2. File được upload qua API route `/api/upload`
3. File được lưu vào thư mục `public/uploads/`
4. Tên file tự động được generate: `timestamp-random.extension`
5. URL truy cập: `/uploads/images/filename.jpg` hoặc `/uploads/videos/filename.mp4`

## Lưu ý quan trọng

### 1. Bảo mật

Thư mục uploads đã được cấu hình trong `.gitignore`:
- File upload **KHÔNG** được commit lên Git
- Chỉ cấu trúc thư mục được track

### 2. Backup

File upload **KHÔNG** tự động backup. Bạn cần:
- Backup thủ công thư mục `public/uploads/`
- Hoặc cấu hình backup tự động cho server

### 3. Dung lượng

- File lưu trực tiếp trên ổ đĩa server
- Theo dõi dung lượng để tránh đầy ổ đĩa
- Có thể cần dọn dẹp file cũ định kỳ

### 4. Production

Khi deploy lên production:
- Đảm bảo thư mục `public/uploads/` có quyền ghi (writable)
- Cấu hình Nginx/Apache để serve static files
- Cân nhắc dùng CDN hoặc object storage (S3, Cloudinary) cho production

## Dọn dẹp file cũ

Để xóa tất cả file upload (cẩn thận!):

```bash
# Windows
rmdir /s /q public\uploads\images
rmdir /s /q public\uploads\videos
mkdir public\uploads\images
mkdir public\uploads\videos

# Linux/Mac
rm -rf public/uploads/images/*
rm -rf public/uploads/videos/*
```

## Migrate sang Cloud Storage

Nếu sau này muốn chuyển sang Cloudinary/S3:
1. Chỉ cần sửa file `src/app/api/upload/route.ts`
2. Component `ImageUpload.tsx` không cần sửa
3. Migrate file cũ sang cloud storage
