# LXIXOER4UY 🎉

[![wakatime](https://wakatime.com/badge/user/018c30ee-bce4-4e46-ab03-5214782a4e51/project/52ab3b70-b232-4362-b70b-59a2e6f01a5e.svg)](https://wakatime.com/badge/user/018c30ee-bce4-4e46-ab03-5214782a4e51/project/52ab3b70-b232-4362-b70b-59a2e6f01a5e)

## Hướng dẫn Copy File vào VPS và Chạy 🖥️

### Yêu cầu ✅

- Máy tính cần có `scp` để copy file vào VPS.
- Cần có quyền truy cập SSH vào VPS của mình.

### Bước 1: Copy tệp vào VPS 📂

Dùng lệnh `scp` để copy toàn bộ nội dung trong thư mục `LxixoeR4uy` lên VPS.

Thay thế `vps_address` bằng thông tin VPS đã mua:

```bash
scp -r C:\Users\tank\Desktop\LxixoeR4uy\* root@vps_address:/root
```

**Ví dụ**:

```bash
scp -r C:\Users\tank\Desktop\LxixoeR4uy\* tank@192.168.1.100:/root
```

### Bước 2: Thiết lập quyền thực thi và chạy tệp ⚙️

1. Kết nối vào VPS qua SSH:

    ```bash
    ssh root@vps_address
    ```

2. Truy cập đến thư mục chứa các tệp đã copy:

    ```bash
    cd /root
    ```

3. Thiết lập quyền thực thi cho tệp `setup.sh`:

    ```bash
    chmod +x setup.sh
    ```

4. Chạy `setup.sh`:

    ```bash
    ./setup.sh
    ```

## Copyright 📝

© 2024 OvFTeam. All rights reserved. 💼
