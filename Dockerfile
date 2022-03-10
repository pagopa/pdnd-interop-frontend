FROM node:14.19.0 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install
COPY . .

# The placeholder allows to inject the correct hostname at deploy time
# RUN echo "REACT_APP_FRONTEND_URL=___PUBLIC_URL_PLACEHOLDER___" > /app/.env.production

RUN REACT_APP_FRONTEND_URL=___PUBLIC_URL_PLACEHOLDER___ npm run build

FROM nginx
RUN mkdir -p /usr/share/nginx/html/ui
COPY --from=build /app/build /usr/share/nginx/html/ui