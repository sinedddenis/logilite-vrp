# ---- base (build + run) ----
FROM node:20-alpine

WORKDIR /app

# 1) Copy the whole monorepo (simple + reliable for workspaces)
COPY . .

# 2) Install all deps for all workspaces
RUN npm ci

# 3) Build shared pkg, then the API
RUN npm run -w @logilite/shared build && \
    npm run -w @logilite/api build

# 4) (optional) prune dev deps to slim the image after builds
RUN npm prune --omit=dev || true

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# 5) Start the API
CMD ["node", "apps/api/dist/index.js"]