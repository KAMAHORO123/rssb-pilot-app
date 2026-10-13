# syntax=docker/dockerfile:1

# ---- Stage "builder" ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# NEXT_PUBLIC_* values are inlined into the browser bundle at build time.
# A relative path keeps the image environment-agnostic: every environment
# serves the API on its own hostname under /api (ingress / gateway routing).
ARG NEXT_PUBLIC_API_BASE_URL=/api
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Stage "runtime": only the standalone server + static assets ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
