# Multi-stage production build for SponsorMatch AI
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package.json and workspace package.json files
COPY package.json package-lock.json* ./
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install dependencies across monorepo
RUN npm install

# Copy source files
COPY server/ ./server/
COPY client/ ./client/

# Build client and server
RUN npm run build

# Production runtime container
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/package.json ./
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/client/dist ./client/dist

# Expose port (Render, Fly, Railway auto-bind $PORT)
EXPOSE 3001

CMD ["node", "server/dist/index.js"]
