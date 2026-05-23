# ── Build ─────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10.33.2

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/api/package.json ./apps/api/package.json

RUN PNPM_CONFIG_MINIMUM_RELEASE_AGE=0 pnpm install --frozen-lockfile --filter sendme-api...

COPY apps/api ./apps/api

RUN pnpm --filter sendme-api build

# ── Production ────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm@10.33.2

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/api/package.json ./apps/api/package.json

RUN PNPM_CONFIG_MINIMUM_RELEASE_AGE=0 pnpm install --frozen-lockfile --filter sendme-api... --prod

COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["node", "dist/main.js"]
