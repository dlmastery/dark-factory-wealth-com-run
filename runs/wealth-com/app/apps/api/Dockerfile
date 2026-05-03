FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace manifests first for layer caching
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/contracts/package.json ./packages/contracts/

# Install workspace deps
RUN pnpm install --frozen-lockfile || pnpm install

# Now copy source
COPY apps/api ./apps/api
COPY packages ./packages
COPY tsconfig.base.json ./

WORKDIR /app/apps/api
RUN pnpm build || true

EXPOSE 3000
CMD ["pnpm", "start"]
