# build stage
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN set -ex \
    && npm install

COPY . .
#COPY .env.deploy_prod .

RUN npm run build:prod

# production stage
FROM nginxinc/nginx-unprivileged:1-alpine as production-stage

LABEL maintainer="DNum DIP - Université de Strasbourg <dnum-dip@unistra.fr>" \
      app="plana"

EXPOSE 80

ENV TZ=Europe/Paris

#COPY nginx/etu-campulse.fr.conf  /nginx/etu-campulse.fr.conf
#COPY nginx/etu-campulse.fr.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
