# Sử dụng Node.js 20.16.0 làm image cơ sở
FROM node:20.16.0

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json (hoặc yarn.lock) trước
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ code source
COPY . .

# Build ứng dụng
RUN npm run build

# Mở port 3001
EXPOSE 3000

# Chạy ứng dụng sử dụng command "start" từ package.json
CMD ["npm", "run", "start"]