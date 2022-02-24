FROM node:12.18.2 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

# RUN npm install
RUN node --max-old-space-size=250 `which npm` install
COPY . .
RUN npm run build

FROM nginx
RUN mkdir -p /usr/share/nginx/html/ui
COPY --from=build /app/build /usr/share/nginx/html/ui