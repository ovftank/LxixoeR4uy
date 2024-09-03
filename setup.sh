#!/bin/bash

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

install_packages() {
    log "Cập nhật và cài đặt các gói..."
    sudo apt update && sudo apt upgrade -y && sudo apt --fix-broken install && sudo apt autoremove --purge -y
    sudo apt install -y nginx python3 python3-distutils ca-certificates wget --fix-missing
}

configure_nginx() {
    local config_file="/etc/nginx/sites-available/default"
    local config_file2="/etc/nginx/sites-enabled/default"

    log "Tạo cấu hình Nginx..."
    sudo tee $config_file > /dev/null << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
    sudo ln -sf $config_file $config_file2
}

setup_python() {
    log "Cài đặt Python và pip..."
    mkdir -p ~/.config/pip/
    echo -e "[global]\nbreak-system-packages = true" > ~/.config/pip/pip.conf
    wget https://bootstrap.pypa.io/get-pip.py
    sudo python3 get-pip.py
    python3 -m pip install --upgrade pip
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt gunicorn
}
setup_gunicorn() {
    log "Tạo và khởi động service Gunicorn..."
    sudo tee /etc/systemd/system/gunicorn.service > /dev/null << EOF
[Unit]
Description=Gunicorn instance to serve Flask application
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=/root/
ExecStart=/bin/bash -c 'source /root/venv/bin/activate && /root/venv/bin/gunicorn --workers 4 -b 0.0.0.0:8000 app:app'

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable gunicorn
    sudo systemctl restart gunicorn
}

main() {
    install_packages
    configure_nginx
    setup_python
    setup_gunicorn

    log "Khởi động lại Nginx..."
    sudo nginx -t && sudo systemctl restart nginx

    log "Xác nhận trạng thái của Nginx..."
    sudo systemctl status nginx

    log "Hoàn tất cấu hình. Ứng dụng của bạn sẽ được phục vụ từ /root/dist."
}

main
