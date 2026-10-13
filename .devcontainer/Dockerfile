FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

ENV npm_config_store_dir=/home/node/.local/share/pnpm/store \
    PLAYWRIGHT_BROWSERS_PATH=/home/node/.cache/ms-playwright

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl jq gosu \
    && npm uninstall -g pnpm \
    && corepack enable \
    && corepack prepare pnpm@9.15.9 --activate \
    && npx --yes playwright@1.61.1 install-deps chromium \
    && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /usr/local/bin/frontend-entrypoint
RUN chmod +x /usr/local/bin/frontend-entrypoint

EXPOSE 5173
ENTRYPOINT ["/usr/local/bin/frontend-entrypoint"]
