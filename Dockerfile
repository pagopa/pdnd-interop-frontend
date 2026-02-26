FROM node:22.14.0@sha256:cfef4432ab2901fd6ab2cb05b177d3c6f8a7f48cb22ad9d7ae28bb6aa5f8b471 as build
RUN corepack enable

WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:1.29.2@sha256:3b7732505933ca591ce4a6d860cb713ad96a3176b82f7979a8dfa9973486a0d6
RUN mkdir -p /usr/share/nginx/html/ui
COPY --from=build /app/dist /usr/share/nginx/html/ui
