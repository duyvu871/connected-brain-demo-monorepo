FROM node:20-alpine AS base

FROM base AS builder

RUN apk update
RUN apk add --no-cache libc6-compat
# Install Python3 and pip3
RUN apk add --no-cache python3 py3-pip
# Install build tools for canvas
RUN apk add --no-cache build-base cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev libtool autoconf automake
# Install ImageMagick
RUN apk add --no-cache imagemagick
# Set the working directory in the container
WORKDIR /connected-brain-demo-monorepo

# Install the latest version of npm
RUN npm install -g npm@10.8.1  && npm cache clean --force
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
RUN npx turbo prune web --docker

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



RUN npx turbo build --filter=web...

FROM base AS runner
WORKDIR /connected-brain-demo-monorepo

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /connected-brain-demo-monorepo/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /connected-brain-demo-monorepo/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /connected-brain-demo-monorepo/apps/web/public ./apps/web/public

WORKDIR /connected-brain-demo-monorepo/apps/web

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
