FROM node:22-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat

# Set up the application directory for the base stage
WORKDIR /app

# Set required environment variables
ENV SHELL=/bin/sh \
    ENV=/etc/profile \
    PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# Install turbo globally
RUN npm install -g pnpm && \
  pnpm setup && \
  pnpm add -g turbo@^2.5.5

# Copy everything
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune server --docker

# Installer stage
FROM base AS installer

RUN apk add --no-cache gcompat

# Set up the application directory for the installer stage
WORKDIR /app

# Copy pruned lockfile and package.json from builder
COPY --from=builder /app/out/json/ .

# Copy source files from builder
COPY --from=builder /app/out/full/ .

# Install dependencies
RUN npm install -g pnpm && \
  pnpm install --frozen-lockfile

# Build the app
RUN pnpm exec turbo run build

# Production stage with only essential files
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 hono

# Copy files
COPY --from=installer --chown=hono:nodejs /app/pnpm-workspace.yaml ./
COPY --from=installer --chown=hono:nodejs /app/packages ./packages
COPY --from=installer --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=hono:nodejs /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=installer --chown=hono:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=installer --chown=hono:nodejs /app/package.json ./package.json
COPY --from=installer --chown=hono:nodejs /app/apps/server/package.json ./apps/server/package.json

# Set environment variables
ENV NODE_ENV=production \
    HOSTNAME="0.0.0.0" \
    PORT=8000

USER hono

EXPOSE 8000

CMD ["node", "apps/server/dist/src/server.js"]