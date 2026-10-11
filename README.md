# Phiếu thông tin khách hàng – Bác sĩ Da liễu Việt Hoa

## Tổng quan

Đây là website tĩnh bằng HTML, CSS và JavaScript để khách hàng điền phiếu thông tin về da hoặc tóc. Người dùng chọn loại phiếu, nhập câu trả lời, rồi tạo ảnh PNG để tải xuống hoặc chia sẻ qua bảng chia sẻ của điện thoại. Câu trả lời được lưu trong `localStorage` của trình duyệt.

Repository không có backend, hệ thống đăng nhập, cấu hình build/package hay bộ kiểm thử. Trong mã hiện tại không có thao tác gửi câu trả lời tới máy chủ; các trang tải Google Fonts từ bên ngoài.

## Cấu trúc và vai trò các file

| File | Vai trò |
| --- | --- |
| `index.html` | Trang chủ thương hiệu, hiển thị lựa chọn điền phiếu **Da** (`da.html`) hoặc **Tóc** (`toc.html`). CSS của trang được viết trực tiếp trong file. |
| `da.html` | Biểu mẫu da gồm 30 câu, chia thông tin chung và tình trạng da. Các câu 1, 3, 4 được đánh dấu bắt buộc; có nút tạo ảnh, chia sẻ ảnh, tải ảnh và xóa dữ liệu. Chứa CSS nội tuyến và tải `script.js`. |
| `toc.html` | Biểu mẫu tóc gồm 25 câu, chia thông tin chung và tình trạng tóc/da đầu. Các câu 1, 3, 4 được đánh dấu bắt buộc; có nút tạo ảnh, chia sẻ ảnh, tải ảnh và xóa dữ liệu. Chứa CSS nội tuyến và tải `script.js`. |
| `script.js` | Dùng chung cho hai biểu mẫu: kiểm tra các câu bắt buộc, vẽ câu hỏi/câu trả lời cùng logo lên Canvas, tự tải PNG xuống sau khi tạo, cung cấp nút tải lại và chia sẻ ảnh qua Web Share API. Đồng thời tự lưu và phục hồi câu trả lời. |
| `style.css` | Các quy tắc CSS tổng quát cho giao diện lựa chọn và biểu mẫu. Không thấy trang HTML hiện tại nào liên kết file này; giao diện đang dùng CSS nội tuyến trong từng trang. |
| `images/logo.png` | Logo, dùng ở các trang và được vẽ vào ảnh phiếu. |
| `images/header-bg.jpg` | Ảnh nền phần đầu trang chủ. |
| `images/da.jpg` | Ảnh minh họa lựa chọn phiếu da ở trang chủ. |
| `images/toc.jfif` | Ảnh minh họa lựa chọn phiếu tóc ở trang chủ. |
| `images/.keep` | File giữ thư mục `images` trong Git; không tham gia lúc chạy website. |

## Luồng hoạt động

1. Người dùng mở `index.html`, chọn phiếu da hoặc tóc.
2. Trang không chuyển hướng hoặc chặn người dùng dựa trên User-Agent; có thể mở trong trình duyệt thường hoặc trình duyệt nhúng của ứng dụng nhắn tin.
3. Câu trả lời được lưu theo ID ô nhập (`q1`, `q2`, ...) vào `localStorage` trong lúc nhập và được điền lại khi mở trang tương ứng.
4. Nút **TẠO ẢNH** yêu cầu có nội dung ở `q1`, `q3`, `q4`, sau đó vẽ phiếu lên Canvas và yêu cầu tải xuống `Thong_tin_DA.png` hoặc `Thong_tin_TÓC.png`. Sau khi tạo, có thêm nút **CHIA SẺ ẢNH** và **TẢI ẢNH XUỐNG**.
5. Chia sẻ dùng Web Share API của trình duyệt, nếu hỗ trợ chia sẻ tệp; khách chọn Zalo, Messenger hoặc ứng dụng khác từ bảng chia sẻ. Nếu không hỗ trợ, nút chia sẻ chuyển sang tải ảnh xuống.
6. Nút **XOÁ THÔNG TIN** gọi `localStorage.clear()` rồi tải lại trang.

## Mở trang từ Zalo/Messenger và chia sẻ ảnh

Trước đây, `zalo-block.js` dùng User-Agent để chuyển một số trình duyệt nhúng sang `zalo-block.html`. Điều kiện không riêng cho iPhone hoặc Zalo: nó cũng khớp Android WebView và một số trình duyệt nhúng iPhone. Mục đích thể hiện trong trang hướng dẫn là yêu cầu dùng trình duyệt ngoài để tạo/tải ảnh, nhưng cách này khiến người dùng không vào được biểu mẫu ngay trong ứng dụng nhắn tin và không khôi phục URL form sau khi chuyển.

Hai file chặn đã được gỡ khỏi luồng website để link mở trực tiếp trên các thiết bị và ứng dụng. Việc tạo ảnh không tự gửi dữ liệu đi đâu: khách có thể dùng bảng chia sẻ của điện thoại để tự chọn người nhận. Khả năng chia sẻ file tùy thuộc trình duyệt và môi trường nhúng; vì vậy form vẫn yêu cầu tải ảnh tự động sau khi tạo và có nút tải ảnh riêng làm phương án dự phòng. Nếu trình duyệt không hỗ trợ Web Share API cho file, nút chia sẻ cũng chuyển sang tải ảnh xuống.

## Lưu ý về dữ liệu và kỹ thuật

- Biểu mẫu chứa thông tin nhận dạng cá nhân (họ tên, số điện thoại, ngày sinh, địa chỉ) và thông tin sức khỏe. Câu trả lời được lưu trong `localStorage` của trình duyệt; người dùng chung thiết bị/trình duyệt có thể thấy lại dữ liệu này. Ảnh vừa tạo được giữ trong bộ nhớ của trang để chia sẻ/tải xuống, không được lưu lâu dài trong `localStorage`.
- Không có chức năng gửi dữ liệu lên backend trong mã hiện tại. Tuy nhiên các trang yêu cầu Google Fonts từ bên ngoài, nên trình duyệt vẫn kết nối tới dịch vụ cung cấp font.
- `xoaDuLieu()` gọi `localStorage.clear()`, thao tác này xóa toàn bộ local storage của cùng origin, không chỉ các khóa do biểu mẫu tạo.
- Chiều cao Canvas được ước lượng trước khi vẽ; câu hỏi/câu trả lời dài có thể xuống nhiều dòng hơn ước lượng. Cần kiểm thử với dữ liệu dài nếu yêu cầu ảnh luôn hiển thị đầy đủ nội dung.
- `style.css` hiện không được liên kết. Nếu muốn thay đổi giao diện đang hiển thị, cần sửa CSS nội tuyến tương ứng trong `index.html`, `da.html` hoặc `toc.html`, hoặc chủ động chuyển các quy tắc sang stylesheet chung.
