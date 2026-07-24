FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends jq socat tmux \
    && corepack enable \
    && rm -rf /var/lib/apt/lists/*

RUN npx --yes playwright@1.61.1 install-deps chromium \
    && rm -rf /var/lib/apt/lists/*
