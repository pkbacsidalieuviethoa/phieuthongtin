# Phiếu thông tin khách hàng – Bác sĩ Da liễu Việt Hoa

## Tổng quan

Đây là website tĩnh bằng HTML, CSS và JavaScript để khách hàng điền phiếu thông tin về da hoặc tóc. Người dùng chọn loại phiếu, nhập câu trả lời, rồi tạo ảnh PNG để tải xuống hoặc chia sẻ qua bảng chia sẻ của điện thoại. Câu trả lời được lưu trong `localStorage` của trình duyệt.

Repository không có backend, hệ thống đăng nhập, cấu hình build/package hay bộ kiểm thử. Trong mã hiện tại không có thao tác gửi câu trả lời tới máy chủ; các trang tải Google Fonts từ bên ngoài.

## Cấu trúc và vai trò các file

| File | Vai trò |
| --- | --- |
| `index.html` | Trang chủ thương hiệu, hiển thị lựa chọn điền phiếu **Da** (`da.html`) hoặc **Tóc** (`toc.html`). CSS của trang được viết trực tiếp trong file. |
| `da.html` | Biểu mẫu da gồm 30 câu hiện có và một trường tuổi tách riêng, chia thông tin chung và tình trạng da. Họ tên và tuổi là hai trường riêng; cùng với số điện thoại và ngày sinh, đây là các trường bắt buộc. Các câu có placeholder hướng dẫn trả lời trung lập. Có popup sau khi tạo ảnh với lựa chọn chia sẻ, tải ảnh và để sau. |
| `toc.html` | Biểu mẫu tóc gồm 25 câu hiện có và một trường tuổi tách riêng, chia thông tin chung và tình trạng tóc/da đầu. Họ tên và tuổi là hai trường riêng; cùng với số điện thoại và ngày sinh, đây là các trường bắt buộc. Các câu có placeholder hướng dẫn trả lời trung lập. Có popup sau khi tạo ảnh với lựa chọn chia sẻ, tải ảnh và để sau. |
| `script.js` | Dùng chung cho hai biểu mẫu: kiểm tra họ tên, tuổi, số điện thoại và ngày sinh; vẽ câu trả lời lên Canvas, tự tải PNG xuống và mở popup chia sẻ. Đồng thời tự lưu và phục hồi câu trả lời. |
| `style.css` | Các quy tắc CSS tổng quát cho giao diện lựa chọn và biểu mẫu. Không thấy trang HTML hiện tại nào liên kết file này; giao diện đang dùng CSS nội tuyến trong từng trang. |
| `images/logo.png` | Logo, dùng ở các trang và được vẽ vào ảnh phiếu. |
| `images/header-bg.jpg` | Ảnh nền phần đầu trang chủ. |
| `images/da.jpg` | Ảnh minh họa lựa chọn phiếu da ở trang chủ. |
| `images/toc.jfif` | Ảnh minh họa lựa chọn phiếu tóc ở trang chủ. |
| `images/.keep` | File giữ thư mục `images` trong Git; không tham gia lúc chạy website. |

## Luồng hoạt động

1. Người dùng mở `index.html`, chọn phiếu da hoặc tóc.
2. Trang không chuyển hướng hoặc chặn người dùng dựa trên User-Agent; có thể mở trong trình duyệt thường hoặc trình duyệt nhúng của ứng dụng nhắn tin.
3. Câu trả lời được lưu theo ID ô nhập (`q1`, `q2`, ... và `age`) vào `localStorage` trong lúc nhập và được điền lại khi mở trang. `q1` là họ tên, `age` là tuổi; các ID câu hỏi còn lại được giữ nguyên. URL script có phiên bản để trình duyệt tải bản cập nhật thay vì tiếp tục dùng JavaScript cũ trong cache.
4. Placeholder nêu ví dụ/trường thông tin hữu ích cho mỗi câu hỏi bệnh sử và triệu chứng; nội dung gợi ý khuyến khích mô tả điều người dùng biết, không tự kết luận chẩn đoán.
5. Trước khi tạo ảnh, họ tên (`q1`) phải có ít nhất 2 ký tự và tuổi (`age`) không được để trống, phải là số từ 0 đến 120. `q3` phải là 10 chữ số bắt đầu bằng 0, còn `q4` phải là ngày hợp lệ dạng `DD/MM/YYYY` không nằm trong tương lai. Lỗi hiển thị ngay dưới trường tương ứng, khi rời trường hoặc bấm **TẠO ẢNH**; người dùng phải sửa trước khi tiếp tục. Dữ liệu cũ ở `q1` theo dạng “Họ tên – 28 tuổi” được tự tách khi mở trang nếu chưa có giá trị tuổi đã lưu.
6. Nút **TẠO ẢNH** sau khi vượt kiểm tra sẽ vẽ phiếu lên Canvas, yêu cầu tải xuống `Thong_tin_DA.png` hoặc `Thong_tin_TÓC.png` và mở popup chia sẻ.
7. Popup giải thích việc gửi phiếu tới phòng khám là tùy chọn, rồi cho khách chia sẻ qua Web Share API, tải ảnh xuống lần nữa hoặc chọn **ĐỂ SAU**. Khi có hỗ trợ chia sẻ tệp, khách chọn Zalo, Messenger hoặc ứng dụng khác từ bảng chia sẻ; nếu không hỗ trợ, thao tác chia sẻ chuyển sang tải ảnh xuống. Popup dùng hộp thoại HTML gốc khi trình duyệt hỗ trợ và có phương án hiển thị thay thế cho trình duyệt cũ.
8. Nút **XOÁ THÔNG TIN** gọi `localStorage.clear()` rồi tải lại trang.

## Mở trang từ Zalo/Messenger và chia sẻ ảnh

Trước đây, `zalo-block.js` dùng User-Agent để chuyển một số trình duyệt nhúng sang `zalo-block.html`. Điều kiện không riêng cho iPhone hoặc Zalo: nó cũng khớp Android WebView và một số trình duyệt nhúng iPhone. Mục đích thể hiện trong trang hướng dẫn là yêu cầu dùng trình duyệt ngoài để tạo/tải ảnh, nhưng cách này khiến người dùng không vào được biểu mẫu ngay trong ứng dụng nhắn tin và không khôi phục URL form sau khi chuyển.

Hai file chặn đã được gỡ khỏi luồng website để link mở trực tiếp trên các thiết bị và ứng dụng. Việc tạo ảnh không tự gửi dữ liệu đi đâu: khách có thể dùng popup và bảng chia sẻ của điện thoại để tự chọn người nhận; nội dung popup nhấn mạnh chỉ chia sẻ khi khách đồng ý. Khả năng chia sẻ file tùy thuộc trình duyệt và môi trường nhúng; vì vậy form vẫn yêu cầu tải ảnh tự động sau khi tạo và có lựa chọn tải riêng trong popup. Nếu trình duyệt không hỗ trợ Web Share API cho file, thao tác chia sẻ cũng chuyển sang tải ảnh xuống.

## Lưu ý về dữ liệu và kỹ thuật

- Biểu mẫu chứa thông tin nhận dạng cá nhân (họ tên, số điện thoại, ngày sinh, địa chỉ) và thông tin sức khỏe. Câu trả lời được lưu trong `localStorage` của trình duyệt; người dùng chung thiết bị/trình duyệt có thể thấy lại dữ liệu này. Ảnh vừa tạo được giữ trong bộ nhớ của trang để chia sẻ/tải xuống, không được lưu lâu dài trong `localStorage`.
- Không có chức năng gửi dữ liệu lên backend trong mã hiện tại. Tuy nhiên các trang yêu cầu Google Fonts từ bên ngoài, nên trình duyệt vẫn kết nối tới dịch vụ cung cấp font.
- `xoaDuLieu()` gọi `localStorage.clear()`, thao tác này xóa toàn bộ local storage của cùng origin, không chỉ các khóa do biểu mẫu tạo.
- Chiều cao Canvas được ước lượng trước khi vẽ; câu hỏi/câu trả lời dài có thể xuống nhiều dòng hơn ước lượng. Cần kiểm thử với dữ liệu dài nếu yêu cầu ảnh luôn hiển thị đầy đủ nội dung.
- `style.css` hiện không được liên kết. Nếu muốn thay đổi giao diện đang hiển thị, cần sửa CSS nội tuyến tương ứng trong `index.html`, `da.html` hoặc `toc.html`, hoặc chủ động chuyển các quy tắc sang stylesheet chung.
