-- Cập nhật user hiện có thành ADMIN
-- Thay 'your@email.com' bằng email của bạn

-- Xem tất cả users
SELECT id, email, name, role, provider FROM users;

-- Cập nhật user thành ADMIN (thay email của bạn)
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';

-- Hoặc cập nhật theo ID
-- UPDATE users SET role = 'ADMIN' WHERE id = 1;

-- Kiểm tra sau khi cập nhật
SELECT id, email, name, role, provider FROM users WHERE role = 'ADMIN';
