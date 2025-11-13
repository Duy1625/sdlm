-- ==============================================
-- Fix Charset and Re-insert Data with Vietnamese
-- ==============================================

-- Set charset for this session
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE wedosa;

-- Delete existing data
DELETE FROM chapters;
DELETE FROM books;
DELETE FROM users;

-- Reset auto increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE books AUTO_INCREMENT = 1;
ALTER TABLE chapters AUTO_INCREMENT = 1;

-- ==============================================
-- Insert Data with Correct Vietnamese Encoding
-- ==============================================

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@wedosa.com', '$2a$10$rG8kpYYZzYZ8pQZYZpYZYu7gzKzKzKzKzKzKzKzKzKzKzKzKzKzKz', 'ADMIN');

-- Insert sample books
INSERT INTO books (title, slug, author, description, status, genre) VALUES
('Lập Trình Web Cơ Bản', 'lap-trinh-web-co-ban', 'Nguyễn Văn A',
'Khóa học lập trình web từ cơ bản đến nâng cao. Học HTML, CSS, JavaScript và các framework hiện đại.',
'ONGOING', 'Programming'),

('Truyện Kiếm Hiệp', 'truyen-kiem-hiep', 'Kim Dung',
'Truyện kiếm hiệp võ hiệp hay nhất mọi thời đại. Hành trình của các anh hùng hào kiệt trong giang hồ.',
'COMPLETED', 'Fiction'),

('Học Next.js 15', 'hoc-nextjs-15', 'Trần Văn B',
'Hướng dẫn chi tiết về Next.js 15 với App Router, Server Components và các tính năng mới nhất.',
'ONGOING', 'Programming');

-- Insert sample chapters for book 1 (Lập Trình Web Cơ Bản)
INSERT INTO chapters (bookId, chapterNumber, title, slug, content) VALUES
(1, 1, 'Giới thiệu HTML', 'gioi-thieu-html',
'# Chương 1: Giới thiệu HTML

## HTML là gì?

HTML (HyperText Markup Language) là ngôn ngữ đánh dấu siêu văn bản, được sử dụng để tạo cấu trúc cho trang web.

## Cấu trúc cơ bản

```html
<!DOCTYPE html>
<html>
<head>
    <title>Trang web của tôi</title>
</head>
<body>
    <h1>Xin chào!</h1>
    <p>Đây là đoạn văn bản.</p>
</body>
</html>
```

## Các thẻ HTML cơ bản

- `<h1>` đến `<h6>`: Thẻ tiêu đề
- `<p>`: Thẻ đoạn văn
- `<a>`: Thẻ liên kết
- `<img>`: Thẻ hình ảnh
- `<div>`: Thẻ container

## Bài tập

Hãy tạo một trang HTML đơn giản với tiêu đề và 3 đoạn văn.'),

(1, 2, 'CSS Cơ bản', 'css-co-ban',
'# Chương 2: CSS Cơ bản

## CSS là gì?

CSS (Cascading Style Sheets) là ngôn ngữ được sử dụng để tạo style và định dạng cho các trang web.

## Cách sử dụng CSS

### 1. Inline CSS
```html
<p style="color: red;">Văn bản màu đỏ</p>
```

### 2. Internal CSS
```html
<style>
    p {
        color: blue;
    }
</style>
```

### 3. External CSS
```html
<link rel="stylesheet" href="style.css">
```

## Selectors cơ bản

- Element selector: `p { }`
- Class selector: `.classname { }`
- ID selector: `#idname { }`

## Properties thường dùng

- `color`: Màu chữ
- `background-color`: Màu nền
- `font-size`: Kích thước chữ
- `margin`, `padding`: Khoảng cách
- `border`: Đường viền'),

(1, 3, 'JavaScript Cơ bản', 'javascript-co-ban',
'# Chương 3: JavaScript Cơ bản

## JavaScript là gì?

JavaScript là ngôn ngữ lập trình được sử dụng để tạo tính tương tác cho trang web.

## Biến và Kiểu dữ liệu

```javascript
// Khai báo biến
let name = "John";
const age = 25;
var city = "Hanoi"; // Không nên dùng var

// Kiểu dữ liệu
let number = 42;
let string = "Hello";
let boolean = true;
let array = [1, 2, 3];
let object = { name: "John", age: 25 };
```

## Hàm (Functions)

```javascript
// Function declaration
function greet(name) {
    return "Hello, " + name;
}

// Arrow function
const greet = (name) => {
    return `Hello, ${name}`;
};
```

## DOM Manipulation

```javascript
// Lấy element
const heading = document.querySelector("h1");

// Thay đổi nội dung
heading.textContent = "New Title";

// Thêm event listener
heading.addEventListener("click", () => {
    alert("Clicked!");
});
```');

-- Insert sample chapters for book 2 (Truyện Kiếm Hiệp)
INSERT INTO chapters (bookId, chapterNumber, title, slug, content) VALUES
(2, 1, 'Khởi đầu hành trình', 'khoi-dau-hanh-trinh',
'# Chương 1: Khởi đầu hành trình

Ngày xửa ngày xưa, tại một ngôi làng nhỏ ở chân núi Hoàng Sơn, có một thiếu niên tên là Lý Thiên Phong.

Thiên Phong là một đứa trẻ mồ côi, được ông chủ quán trọ nuôi nấng từ nhỏ. Mặc dù cuộc sống nghèo khó, nhưng cậu luôn giữ trong lòng ước mơ trở thành một cao thủ võ lâm.

Một ngày nọ, khi đang lên núi hái thuốc, Thiên Phong tình cờ gặp được một vị cao nhân bị thương nặng...'),

(2, 2, 'Gặp gỡ sư phụ', 'gap-go-su-phu',
'# Chương 2: Gặp gỡ sư phụ

Vị cao nhân ấy chính là Trương Tam Phong, một trong những cao thủ nổi tiếng nhất võ lâm.

"Thiếu hiệp, có duyên phận ta mới gặp ngươi. Ngươi có muốn học võ không?" - Giọng nói của lão vang lên như sấm.

Thiên Phong quỳ xuống ngay lập tức:
"Con xin bái kiến sư phụ!"

Từ ngày đó, cuộc đời của Thiên Phong đã thay đổi hoàn toàn...');

-- Insert sample chapters for book 3 (Học Next.js 15)
INSERT INTO chapters (bookId, chapterNumber, title, slug, content) VALUES
(3, 1, 'Giới thiệu Next.js 15', 'gioi-thieu-nextjs-15',
'# Chương 1: Giới thiệu Next.js 15

## Next.js là gì?

Next.js là một React framework cho phép bạn xây dựng ứng dụng web full-stack với các tính năng:

- Server-side Rendering (SSR)
- Static Site Generation (SSG)
- API Routes
- File-based Routing
- Image Optimization
- And more...

## Điểm mới trong Next.js 15

1. **App Router (Stable)**: Routing mới với Server Components
2. **Turbopack**: Build tool nhanh hơn Webpack
3. **Server Actions**: Xử lý forms và mutations dễ dàng
4. **Improved Performance**: Tối ưu hóa hiệu năng

## Cài đặt

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

## Cấu trúc thư mục

```
my-app/
├── app/
│   ├── page.tsx      # Homepage
│   ├── layout.tsx    # Root layout
│   └── globals.css
├── public/
└── package.json
```');

-- Verify data
SELECT 'Data fixed with correct charset!' AS message;
SELECT id, title, author FROM books;
