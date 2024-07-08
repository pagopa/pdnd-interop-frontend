FROM node:16.15.0@sha256:59eb4e9d6a344ae1161e7d6d8af831cb50713cc631889a5a8c2d438d6ec6aa0f as build

WORKDIR /app

COPY . .
RUN npm i
RUN npm run build

FROM nginx@sha256:67682bda769fae1ccf5183192b8daf37b64cae99c6c3302650f6f8bf5f0f95df
RUN mkdir -p /usr/share/nginx/html/ui
COPY --from=build /app/dist /usr/share/nginx/html/ui
