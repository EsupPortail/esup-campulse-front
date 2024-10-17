# build import-meta-env binary
FROM node:20-slim AS import-meta-env

WORKDIR /app

# install @import-meta-env/cli, build and compile as a single executable :
ARG PKG_CACHE_PATH=/var/run/pkg/cache
RUN  npm i --global esbuild postject \
  && npm i --prefix . @import-meta-env/cli@0.7.x \
  && esbuild \
      "node_modules/@import-meta-env/cli/bin/import-meta-env.js" \
      --bundle --minify --platform=node --target=node20 \
      --outfile=import-meta-env.js \
  && echo '{"disableExperimentalSEAWarning":true,"useCodeCache":true,"main":"import-meta-env.js","output":"sea-prep.blob"}' > sea-config.json \
  && node --experimental-sea-config sea-config.json \
  && cp $(command -v node) import-meta-env \
  && postject import-meta-env \
     NODE_SEA_BLOB sea-prep.blob \
     --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

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
