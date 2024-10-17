# build import-meta-env binary
FROM node:18-bookworm-slim AS import-meta-env

WORKDIR /app

# install last node 18 compatible versions and export as executable :
ARG PKG_CACHE_PATH=/var/run/pkg/cache
RUN  npm i pkg @import-meta-env/cli@0.6.8 \
  && npx pkg --target node18-linux-x64 \
        ./node_modules/@import-meta-env/cli/bin/import-meta-env.js \
        -o import-meta-env

# web server
FROM nginx:mainline

# .env defaults
ENV NODE_ENV=production

# import-meta-env binary
COPY --from=import-meta-env /app/import-meta-env /usr/bin

# invoke import-meta-env at start
COPY nginx/import-meta-env.sh /docker-entrypoint.d/60-import-meta-env.sh

# store nginx configurations
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# prepare defaults and required .env values
COPY .env.docker /etc/nginx/.env
COPY .env.example /etc/nginx/.env.example

# built webapp
COPY dist /usr/share/nginx/html

HEALTHCHECK \
    --interval=30s \
    --timeout=30s \
    --retries=3 \
    CMD curl -sIfo/dev/null http://127.0.0.1:${NGINX_PORT}/50x.html
