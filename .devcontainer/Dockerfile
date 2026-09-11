FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

# Keep pnpm's store in its named volume even when the workspace is a bind mount.
# Debian provides Chromium for both amd64 and arm64; Puppeteer's download does not.
ENV npm_config_store_dir=/home/node/.local/share/pnpm/store \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium jq socat tmux \
    && corepack enable \
    && rm -rf /var/lib/apt/lists/*

RUN npx --yes playwright@1.61.1 install-deps chromium \
    && rm -rf /var/lib/apt/lists/*

# Create the parent before Docker mounts the Playwright browser volume below it.
RUN mkdir -p /home/node/.cache \
    && chown -R node:node /home/node/.cache
