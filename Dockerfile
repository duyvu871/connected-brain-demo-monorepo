# Use Node.js 20 as the base image
FROM node:20-alpine

# Install Python3 and pip3
RUN apk update && \
    apk add --no-cache python3 py3-pip

# Set the working directory in the container
WORKDIR /connected-brain-demo-monorepo

# Copy the entire project code into the container
COPY . .

# Install the latest version of npm
RUN npm install -g npm@10.8.1  && npm cache clean --force

# Install dependencies for both client and server
WORKDIR /connected-brain-demo-monorepo/apps/web/
RUN npm install && npm run build && npm cache clean --force
WORKDIR /connected-brain-demo-monorepo/apps/server/
RUN npm install && npm run build && npm cache clean --force

# Clean up the apt cache
RUN sudo apt-get clean

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