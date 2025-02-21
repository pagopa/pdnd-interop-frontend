FROM node:22.14.0@sha256:cfef4432ab2901fd6ab2cb05b177d3c6f8a7f48cb22ad9d7ae28bb6aa5f8b471 as build

WORKDIR /app

COPY . .
RUN npm i
RUN npm run build

FROM nginx@sha256:67682bda769fae1ccf5183192b8daf37b64cae99c6c3302650f6f8bf5f0f95df
RUN mkdir -p /usr/share/nginx/html/ui
COPY --from=build /app/dist /usr/share/nginx/html/ui
