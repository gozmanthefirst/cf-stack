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
RUN turbo prune client --docker

# Installer stage
FROM base AS installer

RUN apk add --no-cache gcompat

# Set up the application directory for the installer stage
WORKDIR /app

# Copy pruned lockfile and package.json from builder
COPY --from=builder /app/out/json/ .

# Copy source files
COPY --from=builder /app/out/full/ .

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Build the app
RUN pnpm exec turbo run build

# Production stage with only essential files1
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 tanstack

# Copy files from the installer stage
COPY --from=installer --chown=tanstack:nodejs /app/apps/client/.output ./

# Set environment variables
ENV NODE_ENV=production \
    HOSTNAME="0.0.0.0" \
    PORT=3000

USER tanstack

EXPOSE 3000

CMD ["node", "server/index.mjs"]
