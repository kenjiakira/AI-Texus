<!DOCTYPE html>
<html lang="vi">

# Hướng dẫn

## Yêu cầu trước khi bắt đầu
Trước khi bắt đầu, hãy đảm bảo bạn có một Trang Facebook. Nếu bạn chưa có, hãy tạo một Trang Facebook trước.

## Bước 1: Truy cập Facebook Developers
1. **Đi đến Facebook Developers:**
   - Mở trình duyệt web của bạn và truy cập [developers.facebook.com](https://developers.facebook.com).

2. **Tạo Tài khoản Nhà phát triển (nếu bạn chưa có):**
   - Nếu bạn mới sử dụng Facebook Developers, hãy đăng nhập bằng thông tin đăng nhập Facebook của bạn và làm theo hướng dẫn để thiết lập tài khoản nhà phát triển.

## Bước 2: Tạo Ứng dụng
1. **Tạo Ứng dụng:**
   - Nhấp vào "My Apps" ở góc trên bên phải.
   - Chọn "Create App".
   - Chọn "Business" làm loại ứng dụng.
   - Điền các thông tin cần thiết như tên hiển thị ứng dụng và email liên hệ, sau đó nhấp "Create App ID".

## Bước 3: Thêm Sản phẩm Messenger
1. **Thêm Messenger:**
   - Trong thanh bên trái của bảng điều khiển ứng dụng của bạn, nhấp vào "Add Product".
   - Tìm "Messenger" và nhấp vào nút "Set Up" bên cạnh nó.

## Bước 4: Kết nối Trang Facebook của bạn
1. **Tạo mã truy cập Trang:**
   - Cuộn xuống phần "Access Tokens".
   - Nhấp vào "Add or Remove Pages".
   - Làm theo hướng dẫn để kết nối Trang Facebook của bạn.
   - Sau khi kết nối, tạo mã truy cập Trang bằng cách nhấp vào "Generate Token". Sao chép mã này để sử dụng sau.

## Bước 5: Cấu hình Webhooks
1. **Cấu hình Webhooks:**
   - Trong cài đặt Messenger, cuộn xuống phần "Webhooks".
   - Nhấp vào "Setup Webhooks".
   - Nhập các thông tin sau:
     - **Callback URL:** `https://your_hosting.site/webhook`
     - **Verify Token:** `pagebot`
   - Đăng ký các trường sau:
     - `messages`
     - `messaging_optins`
     - `messaging_postbacks`
   - Nhấp vào "Verify and Save".

## Bước 6: Thêm Đăng ký Trang
1. **Đăng ký các sự kiện Trang:**
   - Vẫn trong phần Webhooks, dưới "Page Subscriptions", chọn trang mà bạn đã kết nối trước đó.
   - Đảm bảo rằng `messages`, `messaging_optins` và `messaging_postbacks` đã được chọn cho đăng ký này.

## Bước 7: Lấy Mã truy cập Trang
1. **Lấy Mã:**
   - Quay lại phần "Access Tokens".
   - Sao chép mã truy cập Trang đã được tạo.

## Bước 8: Nhập Mã truy cập Trang
1. **Cấu hình Bot với Mã:**
   - Dán mã truy cập Trang vào `token.txt`.

## Bước 9: Kiểm tra Bot Messenger của bạn
1. **Kiểm tra Chức năng Bot:**
   - Mở Trang Facebook đã kết nối của bạn.
   - Gửi một tin nhắn đến trang của bạn từ một tài khoản Facebook khác hoặc chỉ cần gửi "help" để kiểm tra các lệnh có sẵn.
   - Đảm bảo rằng tài khoản bạn sẽ sử dụng để thử nghiệm bot có vai trò trong ứng dụng.

## Lưu ý:
- Bot chỉ phản hồi cho các tài khoản có vai trò cụ thể được chỉ định trong ứng dụng.

## Thêm Vai trò
1. **Truy cập [developers.facebook.com](https://developers.facebook.com):**
   - Mở trình duyệt web của bạn và truy cập [developers.facebook.com](https://developers.facebook.com).
   
2. **Truy cập Ứng dụng của bạn:**
   - Đăng nhập vào tài khoản Nhà phát triển Facebook của bạn.
   - Điều hướng đến bảng điều khiển hoặc phần "My Apps" để tìm ứng dụng của bạn.
   
3. **Chọn "App Roles":**
   - Khi bạn đã truy cập bảng điều khiển ứng dụng, tìm một phần hoặc tab có nhãn "App Roles" hoặc "Roles and Permissions".
   
4. **Thêm Vai trò:**
   - Trong phần "App Roles", bạn sẽ thấy các tùy chọn để thêm hoặc quản lý vai trò.
   - Nhấp vào nút "Add Role" hoặc nút tương tự để bắt đầu thêm vai trò.
   
5. **Định nghĩa Chi tiết Vai trò:**
   - Chỉ định tên và quyền liên quan đến vai trò mới mà bạn muốn thêm. Bạn có thể tạo các vai trò tùy chỉnh phù hợp với yêu cầu của ứng dụng.
   
6. **Gán Vai trò cho Người dùng:**
   - Sau khi định nghĩa vai trò, bạn có thể gán nó cho các người dùng cụ thể liên quan đến ứng dụng của bạn. Bạn có thể cần cung cấp tên người dùng hoặc ID người dùng để gán vai trò.

## Tín dụng
  - Tệp này được tạo bởi ChatGPT, Blackbox AI , Adrian và Hoàng Ngọc Từ
  - Credits bởi Liane Cagara (https://liaspark.chatbotcommunity.ltd) vì Sumi API
  - Credits bởi Deku (https://deku-rest-api-3ijr.onrender.com) vì Claude3, Gpt4, Lyrics, Spotify, SmsBomb, và Spotify APIs
    
  **Lưu ý!**
   - Bạn có quyền sửa đổi tệp này. Bạn có thể làm bất cứ điều gì bạn muốn.

</html>
