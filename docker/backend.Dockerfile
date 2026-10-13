# syntax=docker/dockerfile:1

# Base image is pinned by tag AND digest: the tag says what it is, the digest
# guarantees the exact bytes. Dependabot proposes updates to both.

# ---- Stage "builder": all dependencies (incl. dev) + compile ----
FROM node:24.21.0-alpine3.23@sha256:9ec4a2e289874ed0d722e1772ec2de45d2801541db8612f3638b26f128c69ac2 AS builder
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
USER 1000:1000
CMD ["sh", "-c", "npx prisma migrate deploy && if [ \"$RUN_SEED\" = \"true\" ]; then npx prisma db seed; fi"]

# ---- Stage "prod-deps": production-only node_modules ----
FROM node:24.21.0-alpine3.23@sha256:9ec4a2e289874ed0d722e1772ec2de45d2801541db8612f3638b26f128c69ac2 AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---- Target "runtime" (default, last stage): the slim API image ----
FROM node:24.21.0-alpine3.23@sha256:9ec4a2e289874ed0d722e1772ec2de45d2801541db8612f3638b26f128c69ac2 AS runtime
# The app never needs a package manager at runtime; removing npm/yarn/corepack
# removes their (often vulnerable) bundled dependencies from the attack surface.
RUN apk add --no-cache openssl \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /opt/yarn-* \
              /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
              /usr/local/bin/yarn /usr/local/bin/yarnpkg
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
# Numeric uid/gid ("node" in the base image) so Kubernetes runAsNonRoot can verify it.
USER 1000:1000
EXPOSE 3001
CMD ["node", "dist/main.js"]
