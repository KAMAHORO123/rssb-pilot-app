# syntax=docker/dockerfile:1

# ---- Stage "builder": all dependencies (incl. dev) + compile ----
FROM node:20-alpine AS builder
# Prisma's query engine needs OpenSSL, which Alpine does not ship by default.
RUN apk add --no-cache openssl
WORKDIR /app
# Copy only the manifests first so the slow `npm ci` layer is cached
# until dependencies actually change.
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# ---- Target "migrator": applies migrations (and optional seed data) ----
# Runs as a one-off Kubernetes Job before the app is rolled out.
# Build with: docker build --target migrator ...
FROM builder AS migrator
USER node
CMD ["sh", "-c", "npx prisma migrate deploy && if [ \"$RUN_SEED\" = \"true\" ]; then npx prisma db seed; fi"]

# ---- Target "runtime" (default, last stage): the slim API image ----
FROM node:20-alpine AS runtime
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# Never run as root: "node" (uid 1000) is created by the base image.
USER node
EXPOSE 3001
CMD ["node", "dist/main.js"]
