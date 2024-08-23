#!/bin/bash

echo "Cập nhật hệ thống..."
sudo apt update -y
sudo apt upgrade -y
sudo apt update && sudo apt upgrade -y && sudo apt --fix-broken install && sudo apt autoremove --purge -y
echo "Cài đặt Nginx..."
sudo apt install -y nginx

CONFIG_FILE="/etc/nginx/sites-available/default"
CONFIG_FILE2="/etc/nginx/sites-enabled/default"
echo "Tạo cấu hình Nginx tại $CONFIG_FILE..."
sudo bash -c "cat > $CONFIG_FILE << EOF
server {
    listen 80;
    server_name _;

    root /root/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        internal;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    access_log /var/log/nginx/my-app_access.log;
    error_log /var/log/nginx/my-app_error.log;
}
EOF"

echo "Tạo cấu hình Nginx tại $CONFIG_FILE2..."
sudo bash -c "cat > $CONFIG_FILE2 << EOF
server {
    listen 80;
    server_name _;

    root /root/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        internal;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    access_log /var/log/nginx/my-app_access.log;
    error_log /var/log/nginx/my-app_error.log;
}
EOF"

echo "Đang kích hoạt website"
cp -r dist /root

echo "Kiểm tra cấu hình Nginx..."
sudo nginx -t

echo "Khởi động lại Nginx..."
sudo systemctl restart nginx

echo "Xác nhận trạng thái của Nginx..."
sudo systemctl status nginx

echo "Hoàn tất cấu hình Nginx. Ứng dụng của bạn sẽ được phục vụ từ /root/dist."
