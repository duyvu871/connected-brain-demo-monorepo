# Use the official Node.js image as the base image
FROM node:20-alpine AS base

# Set the working directory in the container
WORKDIR /connected-brain-demo-monorepo

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a lightweight image for the final stage
FROM node:20-alpine AS runner

# Set the working directory in the container
WORKDIR /connected-brain-demo-monorepo

# Copy the built application from the build stage
COPY --from=base /connected-brain-demo-monorepo ./

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]