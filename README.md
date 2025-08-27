# ResumeRank AI

Đây là một ứng dụng Next.js được xây dựng với Firebase Studio. Ứng dụng này sử dụng trí tuệ nhân tạo (AI) để hợp lý hóa quy trình tuyển dụng ban đầu bằng cách tự động phân tích hồ sơ ứng viên so với mô tả công việc.

## Chức năng cốt lõi

*   **Tải lên Hồ sơ và Mô tả công việc:** Nhà tuyển dụng có thể dễ dàng tải lên mô tả công việc (JD) và hồ sơ (CV) của ứng viên ở định dạng PDF.
*   **Phân tích sự phù hợp do AI cung cấp:**
    *   Ứng dụng trích xuất văn bản từ các tài liệu đã tải lên.
    *   Nó sử dụng một mô hình ngôn ngữ lớn (LLM) để so sánh CV với JD.
    *   Nó tạo ra một **điểm số phù hợp** (tính bằng phần trăm) để định lượng mức độ phù hợp của ứng viên.
    *   Nó cung cấp một bản phân tích văn bản chi tiết, nêu bật "Điểm phù hợp" và "Điểm còn thiếu sót".
*   **Tạo câu hỏi phỏng vấn tự động:**
    *   Dựa trên cả JD và CV, AI tạo ra các câu hỏi phỏng vấn được nhắm mục tiêu.
    *   Các câu hỏi được chia thành hai loại: 10 câu hỏi dựa trên mô tả công việc và 10 câu hỏi dựa trên hồ sơ của ứng viên, giúp người phỏng vấn có một cuộc trò chuyện sâu sắc hơn.

## Công nghệ sử dụng

*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
*   **Backend & AI:** Genkit (khung AI của Firebase), Google Gemini
*   **Triển khai:** Firebase App Hosting

## Bắt đầu

Để chạy dự án này trên máy cục bộ của bạn, hãy làm theo các bước sau:

1.  **Cài đặt các dependency:**
    ```bash
    npm install
    ```

2.  **Thiết lập biến môi trường:**
    Tạo một tệp `.env` ở thư mục gốc và thêm khóa API Gemini của bạn:
    ```
    GEMINI_API_KEY=your_google_ai_studio_api_key
    ```
    Bạn có thể lấy khóa API từ [Google AI Studio](https://aistudio.google.com/app/apikey).

3.  **Chạy máy chủ phát triển:**
    Ứng dụng Next.js và các flow Genkit cần chạy đồng thời. Mở hai terminal riêng biệt:

    *   **Terminal 1: Chạy các AI Flow:**
        ```bash
        npm run genkit:watch
        ```

    *   **Terminal 2: Chạy ứng dụng Next.js:**
        ```bash
        npm run dev
        ```

4.  Mở [http://localhost:9002](http://localhost:9002) trong trình duyệt của bạn để xem ứng dụng.

## Triển khai

Dự án này được cấu hình để triển khai dễ dàng lên **Firebase App Hosting**.

1.  **Cài đặt Firebase CLI:** Nếu bạn chưa có, hãy cài đặt Firebase CLI trên toàn cục:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Đăng nhập vào Firebase:**
    ```bash
    firebase login
    ```

3.  **Khởi tạo Firebase trong dự án của bạn (chỉ lần đầu):**
    ```bash
    firebase init hosting
    ```
    *   Chọn một dự án Firebase hiện có hoặc tạo một dự án mới.
    *   Khi được hỏi về thư mục công cộng, hãy nhập `.next`.
    *   Cấu hình làm ứng dụng một trang (SPA): **No**.
    *   Thiết lập các bản dựng và triển khai tự động với GitHub: (Tùy chọn)

4.  **Triển khai lên Firebase:**
    ```bash
    firebase deploy --only hosting
    ```

Lệnh này sẽ xây dựng ứng dụng Next.js của bạn và triển khai nó lên Firebase App Hosting.
