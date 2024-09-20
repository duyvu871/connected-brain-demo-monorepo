# Use Node.js 20 as the base image
FROM node:20-alpine

# Install Python3 and pip3
RUN apk update && apk add --no-cache python3 py3-pip
RUN apk add --no-cache build-base cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev libtool autoconf automake
# Install ImageMagick
RUN apk add --no-cache imagemagick

# Set the working directory in the container
WORKDIR /connected-brain-demo-monorepo

# Copy the entire project code into the container
COPY . .

# Install the latest version of npm
RUN npm install -g npm@10.8.1  && npm cache clean --force
# Install the latest version of turbo
RUN npm install turbo@2.0.12 --global
# Install PM2 globally
RUN npm install -g pm2@5.4.2

# Install dependencies for both client and server
WORKDIR /connected-brain-demo-monorepo/apps/web/
RUN npm install && npm cache clean --force
WORKDIR /connected-brain-demo-monorepo/apps/server/
RUN npm install && npm cache clean --force

# Expose ports for client and server
EXPOSE 3000
EXPOSE 3001

# Set the working directory in the container
WORKDIR /connected-brain-demo-monorepo
# Build the project with turbo
RUN npm run build

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.container.config.js"]