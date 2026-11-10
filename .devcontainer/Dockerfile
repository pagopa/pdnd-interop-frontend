FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm@sha256:49698b6eae8a476ebfe37652b03a415d66f4e7ea8e1f8253a46b7a7836fe59ef

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
