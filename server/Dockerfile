# ── Stage 1: Build ──────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# ── Stage 2: Production ──────────────────────────────────
FROM node:20-alpine AS production
RUN apk add --no-cache wget

# Non-root user
RUN addgroup -S campusops && adduser -S campusops -G campusops
WORKDIR /app

COPY --from=builder --chown=campusops:campusops /app .

USER campusops
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
