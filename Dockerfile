# Use Node.js 20 as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /connected-brain-demo-monorepo

# Copy the entire project code into the container
COPY . .

# Install dependencies for both client and server
WORKDIR /connected-brain-demo-monorepo/apps/web/
RUN npm install
WORKDIR /connected-brain-demo-monorepo/apps/server/
RUN npm install

# Update apt package lists
RUN apt-get update

# Install ImageMagick
RUN apt-get install -y imagemagick

# Install PM2 globally
RUN npm install -g pm2

# Expose ports for client and server
EXPOSE 3000
EXPOSE 3001

# Set the working directory in the container
WORKDIR /connected-brain-demo-monorepo

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.container.config.js"]