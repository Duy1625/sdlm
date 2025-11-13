# Tài Liệu Phân Tích Nghiệp Vụ - Wedosa

## 1. Tổng Quan Dự Án

**Tên dự án:** Wedosa
**Loại hình:** Website đọc sách trực tuyến
**Mục đích:** Cung cấp nền tảng đọc sách online với khả năng quản lý nội dung cho admin

## 2. Mục Tiêu Nghiệp Vụ

- Xây dựng nền tảng đọc sách miễn phí, dễ sử dụng cho người dùng
- Cung cấp trải nghiệm đọc sách mượt mà với điều hướng giữa các chương
- Cho phép admin quản lý nội dung sách và chương một cách hiệu quả
- Hỗ trợ định dạng Markdown cho nội dung chương

## 3. Phạm Vi Dự Án

### 3.1. Trong Phạm Vi

**Chức năng người dùng:**
- Xem danh sách tất cả sách
- Xem thông tin chi tiết sách và danh sách chương
- Đọc nội dung chương với hỗ trợ Markdown
- Điều hướng giữa các chương (trước/sau)
- Xem các trang thông tin: Giới thiệu, Liên hệ, Điều khoản sử dụng, Chính sách bảo mật

**Chức năng admin:**
- Thêm/Sửa/Xóa sách
- Thêm/Sửa/Xóa chương
- Soạn thảo nội dung chương bằng Markdown

### 3.2. Ngoài Phạm Vi (Phase 1)

- Đăng ký/Đăng nhập người dùng
- Bookmark/Lưu sách yêu thích
- Bình luận và đánh giá
- Tìm kiếm và lọc sách
- Thống kê lượt xem
- Upload file PDF/EPUB

## 4. Phân Tích Stakeholder

### 4.1. Người Dùng (Reader)
- **Nhu cầu:** Đọc sách miễn phí, dễ dàng điều hướng giữa các chương
- **Mục tiêu:** Trải nghiệm đọc mượt mà, không gián đoạn

### 4.2. Admin/Content Manager
- **Nhu cầu:** Quản lý nội dung sách và chương hiệu quả
- **Mục tiêu:** Dễ dàng thêm/sửa/xóa nội dung

### 4.3. Chủ dự án
- **Nhu cầu:** Nền tảng ổn định, dễ bảo trì, có khả năng mở rộng
- **Mục tiêu:** Xây dựng cơ sở người dùng, phát triển thư viện nội dung

## 5. Yêu Cầu Chức Năng

### 5.1. Module Người Dùng

#### FR-001: Trang Chủ
- **Mô tả:** Hiển thị danh sách tất cả sách có sẵn
- **Chi tiết:**
  - Hiển thị ảnh bìa sách
  - Tiêu đề sách
  - Tác giả
  - Mô tả ngắn
  - Số lượng chương
  - Link đến trang chi tiết sách

#### FR-002: Trang Chi Tiết Sách
- **Mô tả:** Hiển thị thông tin đầy đủ về sách và danh sách chương
- **Chi tiết:**
  - Ảnh bìa sách lớn
  - Tiêu đề, tác giả
  - Mô tả đầy đủ
  - Thể loại
  - Trạng thái (Đang viết/Hoàn thành)
  - Danh sách chương với số thứ tự và tiêu đề
  - Link đến từng chương

#### FR-003: Trang Đọc Chương
- **Mô tả:** Hiển thị nội dung chương để người dùng đọc
- **Chi tiết:**
  - Breadcrumb: Tên sách > Tên chương
  - Thông tin chương: Số thứ tự, tiêu đề
  - Nội dung chương (render từ Markdown)
  - Điều hướng đầu chương: Link "Chương trước" (nếu có)
  - Điều hướng cuối chương: Link "Chương tiếp theo" (nếu có)
  - Link "Trở về danh sách chương"

#### FR-004: Trang Thông Tin
- **Mô tả:** Các trang tĩnh cung cấp thông tin
- **Chi tiết:**
  - Giới thiệu về Wedosa
  - Thông tin liên hệ
  - Điều khoản sử dụng
  - Chính sách bảo mật

### 5.2. Module Admin

#### FR-005: Xác Thực Admin
- **Mô tả:** Bảo vệ các trang admin, chỉ admin mới truy cập được
- **Chi tiết:**
  - Đăng nhập admin
  - Session management
  - Redirect nếu chưa đăng nhập

#### FR-006: Quản Lý Sách (CRUD)
- **Mô tả:** Admin có thể thêm, sửa, xóa sách
- **Chi tiết:**
  - **Thêm sách:**
    - Form nhập: Tiêu đề, tác giả, mô tả, thể loại, ảnh bìa, trạng thái
    - Validate dữ liệu
    - Lưu vào database
  - **Sửa sách:**
    - Load thông tin sách hiện tại
    - Form chỉnh sửa
    - Update database
  - **Xóa sách:**
    - Xác nhận trước khi xóa
    - Xóa cascade (xóa cả chương liên quan)
  - **Danh sách sách:**
    - Hiển thị tất cả sách
    - Action buttons: Sửa, Xóa
    - Link thêm sách mới

#### FR-007: Quản Lý Chương (CRUD)
- **Mô tả:** Admin có thể thêm, sửa, xóa chương
- **Chi tiết:**
  - **Thêm chương:**
    - Chọn sách
    - Nhập số thứ tự chương
    - Nhập tiêu đề chương
    - Soạn thảo nội dung bằng Markdown editor
    - Preview Markdown
    - Lưu vào database
  - **Sửa chương:**
    - Load nội dung chương hiện tại
    - Form chỉnh sửa với Markdown editor
    - Preview
    - Update database
  - **Xóa chương:**
    - Xác nhận trước khi xóa
    - Xóa khỏi database
  - **Danh sách chương:**
    - Hiển thị theo sách
    - Sắp xếp theo số thứ tự
    - Action buttons: Sửa, Xóa

## 6. Yêu Cầu Phi Chức Năng

### 6.1. Hiệu Năng
- **NFR-001:** Trang chủ load trong vòng 2 giây với 100 sách
- **NFR-002:** Nội dung chương load trong vòng 1 giây
- **NFR-003:** Hỗ trợ 100 người dùng đồng thời đọc sách

### 6.2. Khả Năng Sử Dụng
- **NFR-004:** Giao diện responsive, hỗ trợ mobile, tablet, desktop
- **NFR-005:** Font chữ dễ đọc, kích thước phù hợp cho đọc lâu
- **NFR-006:** Điều hướng rõ ràng, không quá 3 click để đến nội dung

### 6.3. Bảo Mật
- **NFR-007:** Chỉ admin được truy cập các trang quản lý
- **NFR-008:** Validate và sanitize input để tránh XSS, SQL Injection
- **NFR-009:** Session timeout sau 24h không hoạt động

### 6.4. Khả Năng Bảo Trì
- **NFR-010:** Code tuân thủ Next.js 15 best practices
- **NFR-011:** Sử dụng TypeScript để tăng type safety
- **NFR-012:** Component structure rõ ràng, dễ tái sử dụng

### 6.5. Khả Năng Mở Rộng
- **NFR-013:** Database schema hỗ trợ thêm tính năng trong tương lai
- **NFR-014:** API endpoints có thể mở rộng cho mobile app
- **NFR-015:** Hỗ trợ thêm thể loại, tags cho sách

## 7. User Stories

### 7.1. Người Dùng

**US-001:** Xem Danh Sách Sách
*Là một người dùng, tôi muốn xem danh sách tất cả sách có sẵn để tôi có thể chọn sách muốn đọc.*
- **Acceptance Criteria:**
  - Hiển thị ít nhất: ảnh bìa, tiêu đề, tác giả
  - Click vào sách để xem chi tiết
  - Responsive trên mọi thiết bị

**US-002:** Xem Thông Tin Chi Tiết Sách
*Là một người dùng, tôi muốn xem thông tin đầy đủ về sách và danh sách chương để quyết định đọc.*
- **Acceptance Criteria:**
  - Hiển thị đầy đủ: bìa, tiêu đề, tác giả, mô tả, số chương
  - Danh sách chương có số thứ tự và tiêu đề
  - Click vào chương để đọc

**US-003:** Đọc Nội Dung Chương
*Là một người dùng, tôi muốn đọc nội dung chương với định dạng đẹp và dễ đọc.*
- **Acceptance Criteria:**
  - Nội dung Markdown được render đúng
  - Font chữ dễ đọc, kích thước phù hợp
  - Có thông tin về sách và chương đang đọc

**US-004:** Điều Hướng Giữa Các Chương
*Là một người dùng, tôi muốn dễ dàng chuyển sang chương trước/sau khi đang đọc.*
- **Acceptance Criteria:**
  - Đầu chương có link "Chương trước" (nếu không phải chương 1)
  - Cuối chương có link "Chương tiếp theo" (nếu còn chương)
  - Link rõ ràng, dễ nhấn

**US-005:** Truy Cập Thông Tin Website
*Là một người dùng, tôi muốn biết về website, cách liên hệ và các chính sách.*
- **Acceptance Criteria:**
  - Có trang Giới thiệu
  - Có trang Liên hệ
  - Có trang Điều khoản và Chính sách

### 7.2. Admin

**US-006:** Quản Lý Sách
*Là một admin, tôi muốn thêm/sửa/xóa sách để quản lý thư viện nội dung.*
- **Acceptance Criteria:**
  - Form thêm sách với đầy đủ trường
  - Form sửa sách với dữ liệu hiện tại
  - Xóa sách có xác nhận
  - Validate dữ liệu

**US-007:** Quản Lý Chương
*Là một admin, tôi muốn thêm/sửa/xóa chương với Markdown editor.*
- **Acceptance Criteria:**
  - Form thêm chương với Markdown editor
  - Preview Markdown real-time
  - Form sửa chương load dữ liệu hiện tại
  - Xóa chương có xác nhận

**US-008:** Đăng Nhập An Toàn
*Là một admin, tôi muốn đăng nhập an toàn để bảo vệ nội dung.*
- **Acceptance Criteria:**
  - Form đăng nhập với username/password
  - Session được lưu an toàn
  - Redirect về trang admin sau khi đăng nhập

## 8. Use Cases

### 8.1. UC-001: Đọc Sách

**Actor:** Người dùng
**Mô tả:** Người dùng truy cập website, chọn sách và đọc các chương

**Precondition:**
- Website hoạt động
- Có ít nhất 1 sách với 1 chương

**Main Flow:**
1. Người dùng truy cập trang chủ
2. Hệ thống hiển thị danh sách sách
3. Người dùng click vào một sách
4. Hệ thống hiển thị trang chi tiết sách với danh sách chương
5. Người dùng click vào một chương
6. Hệ thống hiển thị nội dung chương
7. Người dùng đọc nội dung
8. Người dùng click "Chương tiếp theo"
9. Hệ thống load chương tiếp theo
10. Quay lại bước 7

**Alternative Flow:**
- **3a.** Người dùng không thấy sách phù hợp, quay lại trang chủ
- **8a.** Không có chương tiếp theo, hiển thị thông báo "Hết chương"

**Postcondition:**
- Người dùng đã đọc được nội dung

### 8.2. UC-002: Thêm Sách Mới

**Actor:** Admin
**Mô tả:** Admin thêm một sách mới vào hệ thống

**Precondition:**
- Admin đã đăng nhập

**Main Flow:**
1. Admin truy cập trang quản lý sách
2. Admin click nút "Thêm sách mới"
3. Hệ thống hiển thị form thêm sách
4. Admin nhập thông tin: tiêu đề, tác giả, mô tả, upload ảnh bìa, chọn trạng thái
5. Admin click "Lưu"
6. Hệ thống validate dữ liệu
7. Hệ thống lưu sách vào database
8. Hệ thống hiển thị thông báo thành công
9. Hệ thống redirect về danh sách sách

**Alternative Flow:**
- **6a.** Dữ liệu không hợp lệ:
  - Hệ thống hiển thị lỗi
  - Quay lại bước 4
- **7a.** Lỗi database:
  - Hệ thống hiển thị lỗi
  - Admin có thể thử lại

**Postcondition:**
- Sách mới được thêm vào database
- Sách hiển thị trên trang chủ

### 8.3. UC-003: Thêm Chương Mới

**Actor:** Admin
**Mô tả:** Admin thêm một chương mới cho sách

**Precondition:**
- Admin đã đăng nhập
- Có ít nhất 1 sách trong hệ thống

**Main Flow:**
1. Admin truy cập trang quản lý chương
2. Admin chọn sách muốn thêm chương
3. Admin click nút "Thêm chương mới"
4. Hệ thống hiển thị form thêm chương
5. Admin nhập số thứ tự, tiêu đề
6. Admin soạn thảo nội dung bằng Markdown editor
7. Admin preview nội dung
8. Admin click "Lưu"
9. Hệ thống validate dữ liệu
10. Hệ thống lưu chương vào database
11. Hệ thống hiển thị thông báo thành công

**Alternative Flow:**
- **9a.** Dữ liệu không hợp lệ (vd: số thứ tự trùng):
  - Hệ thống hiển thị lỗi
  - Quay lại bước 5
- **10a.** Lỗi database:
  - Hệ thống hiển thị lỗi
  - Admin có thể thử lại

**Postcondition:**
- Chương mới được thêm vào database
- Chương hiển thị trong danh sách chương của sách

## 9. Business Rules

### BR-001: Sắp Xếp Chương
- Chương phải có số thứ tự duy nhất trong một sách
- Chương được sắp xếp theo số thứ tự tăng dần

### BR-002: Xóa Sách
- Khi xóa sách, tất cả chương liên quan cũng bị xóa (CASCADE)

### BR-003: Trạng Thái Sách
- Sách có 2 trạng thái: "Đang viết" hoặc "Hoàn thành"

### BR-004: Markdown Content
- Nội dung chương phải được lưu dạng Markdown
- Hệ thống tự động render Markdown khi hiển thị

### BR-005: Điều Hướng Chương
- Link "Chương trước" chỉ hiển thị nếu không phải chương đầu tiên
- Link "Chương tiếp theo" chỉ hiển thị nếu có chương tiếp theo

## 10. Giả Định và Ràng Buộc

### 10.1. Giả Định
- Người dùng có kết nối internet ổn định
- Người dùng sử dụng trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- Admin có kiến thức cơ bản về Markdown

### 10.2. Ràng Buộc
- **Kỹ thuật:**
  - Phải sử dụng Next.js 15
  - Phải sử dụng Tailwind CSS 3
  - Phải sử dụng MySQL database
- **Thời gian:** (Chưa xác định)
- **Ngân sách:** (Chưa xác định)

## 11. Rủi Ro và Giảm Thiểu

### Rủi Ro 1: Hiệu năng kém với nhiều sách/chương
- **Mức độ:** Trung bình
- **Giảm thiểu:**
  - Implement pagination cho danh sách sách
  - Lazy loading cho nội dung chương
  - Database indexing

### Rủi Ro 2: Bảo mật admin panel
- **Mức độ:** Cao
- **Giảm thiểu:**
  - Implement authentication middleware
  - Sử dụng HTTPS
  - Session management an toàn
  - Input validation và sanitization

### Rủi Ro 3: Markdown injection
- **Mức độ:** Trung bình
- **Giảm thiểu:**
  - Sử dụng thư viện Markdown parser an toàn
  - Sanitize HTML output
  - Content Security Policy headers

## 12. Giao Diện Người Dùng (UI/UX Guidelines)

### 12.1. Trang Chủ
- Layout: Grid/Card layout cho danh sách sách
- Mỗi card sách: Ảnh bìa, tiêu đề, tác giả, số chương
- Hover effect để tăng tính tương tác

### 12.2. Trang Chi Tiết Sách
- Layout: 2 cột (desktop), 1 cột (mobile)
- Cột trái: Ảnh bìa, thông tin sách
- Cột phải: Danh sách chương

### 12.3. Trang Đọc Chương
- Layout: Single column, max-width để dễ đọc (700-800px)
- Typography: Font serif/sans-serif dễ đọc, line-height 1.6-1.8
- Navigation: Sticky header với breadcrumb
- Buttons: Rõ ràng cho chương trước/sau

### 12.4. Admin Panel
- Dashboard với menu sidebar
- Tables cho danh sách sách/chương
- Forms rõ ràng với validation feedback
- Markdown editor với preview pane

## 13. Kế Hoạch Triển Khai

### Phase 1: MVP (Minimum Viable Product)
- Trang chủ với danh sách sách
- Trang chi tiết sách
- Trang đọc chương với điều hướng
- Admin CRUD sách và chương
- Các trang thông tin cơ bản

### Phase 2: Enhancements (Future)
- Đăng ký/Đăng nhập người dùng
- Bookmark và lưu tiến độ đọc
- Tìm kiếm và lọc sách
- Bình luận và đánh giá
- Thống kê lượt xem

## 14. Success Metrics (KPIs)

- **User Engagement:**
  - Số lượng chương đọc mỗi session
  - Thời gian đọc trung bình
  - Bounce rate < 50%

- **Content:**
  - Số lượng sách trong thư viện
  - Số lượng chương mỗi sách
  - Tần suất cập nhật nội dung

- **Technical:**
  - Page load time < 2s
  - Uptime > 99%
  - Zero critical security vulnerabilities

---

**Version:** 1.0
**Ngày tạo:** 2025-10-27
**Người tạo:** BA Team