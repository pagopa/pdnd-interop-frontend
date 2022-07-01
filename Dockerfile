FROM node:16.15.0 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN npm install yarn
RUN yarn install
COPY . .
RUN yarn build

FROM nginx
RUN mkdir -p /usr/share/nginx/html/ui
COPY --from=build /app/build /usr/share/nginx/html/ui
