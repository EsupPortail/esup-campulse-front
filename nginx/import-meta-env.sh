#!/bin/sh

if test -w /usr/share/nginx/html/index.html && grep -qF 'JSON.parse('"'"'"import_meta_env_placeholder"'"'"')' /usr/share/nginx/html/index.html
then
  /usr/bin/import-meta-env --disposable \
    -e /etc/nginx/.env \
    -x /etc/nginx/.env.example \
    -p /usr/share/nginx/html/index.html
fi
