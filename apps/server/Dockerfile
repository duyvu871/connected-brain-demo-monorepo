FROM node:20-alpine AS base

FROM base AS builder

RUN apk update
RUN apk add --no-cache libc6-compat
# Install Python3 and pip3
RUN apk add --no-cache python3 py3-pip
# Install build tools for canvas
RUN apk add --no-cache build-base cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev libtool autoconf automake
# Install ImageMagick
RUN apk add --no-cache imagemagick ghostscript
# Set the working directory in the container
WORKDIR /connected-brain-demo-monorepo

# Install the latest version of npm
RUN npm install -g npm@10.8.1
# Install the latest version of turbo
RUN npm install -g turbo@2.0.12
# Install PM2 globally
RUN npm install -g pm2@5.4.2
# Install concurrently globally
RUN npm install -g concurrently@8.2.2
# Install tsc-alias globally
RUN npm install -g tsc-alias@1.8.10

# Copy the entire project code into the container
COPY . .
RUN npx turbo prune server --docker

# Add lockfile and package.json's of isolated subworkspaces
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
# Install Python3 and pip3
RUN apk add --no-cache python3 py3-pip
# Install build tools for canvas
RUN apk add --no-cache build-base cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev libtool autoconf automake
# Install ImageMagick
RUN apk add --no-cache imagemagick

WORKDIR /connected-brain-demo-monorepo

# First install the dependencies
COPY --from=builder /connected-brain-demo-monorepo/out/json/ .
RUN npm install

# Build the project
COPY --from=builder /connected-brain-demo-monorepo/out/full/ .


# Uncomment and use build arguments to enabled remote caching



RUN npx turbo build --filter=server...

FROM base AS runner
WORKDIR /connected-brain-demo-monorepo

RUN npm install -g npm@10.8.1
# Install PM2 globally
RUN npm install -g pm2@5.4.2
# Install concurrently globally
RUN npm install -g concurrently@8.2.2

COPY --from=installer /connected-brain-demo-monorepo .

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

RUN mkdir -p /connected-brain-demo-monorepo/apps/server/storage
RUN chown -R expressjs:nodejs /connected-brain-demo-monorepo/apps/server/storage
RUN chmod -R 755 /connected-brain-demo-monorepo/apps/server/storage

USER expressjs

WORKDIR /connected-brain-demo-monorepo/apps/server

#CMD ["pm2-runtime", "start", "ecosystem.config.js"]
CMD ["npm", "run", "start:concurrently"]