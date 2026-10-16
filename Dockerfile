# Multi-stage production container build for FinPulse FinTech Platform
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache curl

# Stage 1: Dependencies cache
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production runner
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=5006

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Non-root security user
USER node

EXPOSE 5006
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3   CMD curl -f http://localhost:5006/health || exit 1

CMD ["node", "server/server.js"]
