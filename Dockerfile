FROM node:16.15.0 as build

WORKDIR /app

COPY ./package.json /app/package.json

COPY . .
RUN npm i
RUN npm run build

FROM nginx
RUN mkdir -p /usr/share/nginx/html/ui
COPY --from=build /app/dist /usr/share/nginx/html/ui
