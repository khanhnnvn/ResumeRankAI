#!/bin/bash

# Kịch bản cài đặt và cấu hình PM2 cho ứng dụng ResumeRank AI trên Ubuntu 24.04

echo "Bắt đầu cài đặt ứng dụng ResumeRank AI với PM2..."

# 1. Cài đặt Node.js và npm
if ! command -v node &> /dev/null
then
    echo "Node.js chưa được cài đặt. Đang cài đặt Node.js 20.x..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl
    curl -fsSL https://deb.nodesource.com/pub_20.x/nodistro/repo-setup.sh | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js đã được cài đặt."
fi

# 2. Cài đặt PM2 toàn cục
if ! command -v pm2 &> /dev/null
then
    echo "PM2 chưa được cài đặt. Đang cài đặt PM2..."
    sudo npm install pm2@latest -g
else
    echo "PM2 đã được cài đặt."
fi

# 3. Cài đặt các phụ thuộc của dự án
echo "Đang cài đặt các phụ thuộc của dự án từ package.json..."
npm install

# 4. Xây dựng ứng dụng Next.js cho production
echo "Đang xây dựng ứng dụng Next.js..."
npm run build

# 5. Khởi động ứng dụng với PM2
echo "Đang khởi động ứng dụng với PM2 bằng tệp ecosystem.config.js..."
pm2 start ecosystem.config.js

# 6. Cấu hình PM2 để tự khởi động cùng hệ thống
echo "Đang cấu hình PM2 để khởi động cùng hệ thống..."
pm2 startup | bash # Lệnh này sẽ tạo ra một lệnh khác, và chúng ta thực thi nó
pm2 save

echo "Hoàn tất! Ứng dụng của bạn hiện đang được quản lý bởi PM2."
echo "Sử dụng 'pm2 list' để xem trạng thái các tiến trình."
echo "Sử dụng 'pm2 logs' để xem log."
