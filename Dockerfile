# build stage
FROM node:18-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN set -ex \
    && apk add git \
    && npm install

COPY app .
COPY .env.deploy_prod .

RUN npm run build:prod

# production stage
FROM nginx:stable-alpine as production-stage

LABEL maintainer="DNum DIP - Université de Strasbourg <dnum-dip@unistra.fr>" \
      app="plana"

EXPOSE 80

ENV TZ=Europe/Paris

RUN set -ex \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

COPY nginx.conf /nginx/etu-campulse.fr.conf
COPY --from=build-stage /app/dist /var/www/plana

CMD ["nginx", "-g", "daemon off;"]
