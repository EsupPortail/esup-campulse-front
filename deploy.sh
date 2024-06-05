#!/bin/bash
set -e

PROJECT="plan-a-front"

if [ ! $# -ge 2 ]; then
  echo "👉 Usage: $0 branch/tag goal [--update-nginx-conf] [--update-apache-conf]    IRL: $0 feature/introduce_bug prod"
  exit 1
fi

# Be aware that if you change next line see line 15 & 117 !
TEMP=$(mktemp -d)
REPOSITORY=$(pwd)
DISTANT_REPO="git@git.unistra.fr:di/plan_a/front.git" #$(git config --get remote.origin.url)
WORKING_DIR="$TEMP/git-clone"
DEST_PATH="/var/www/static/plan_a/"

TEST_HOSTS=("root@django-test2.di.unistra.fr")
TEST_NGINX_CONF="plana-test.app.unistra.fr"

PREPROD_HOSTS=("root@rp-dip-pprd-public.di.unistra.fr")
PREPROD_NGINX_CONF="plana-pprd.app.unistra.fr"

PROD_HOSTS=("root@rp-dip-public-m.di.unistra.fr" "root@rp-dip-public-s.di.unistra.fr")
PROD_NGINX_CONF="etu-campulse.fr"

DEMO_HOSTS=("rp-shib3-pprd-1.srv.unistra.fr" "rp-shib3-pprd-2.srv.unistra.fr")
DEMO_APACHE_CONF="campulse-demo.unistra.fr"

# Json info file template
TEMPLATE='{"info":{"app_host":"%s","repo_url":"%s","local_user":"%s","tag":"%s","commit_id":"%s"}}'

# Set env
ENVIRONMENT="$2"

# Shall we install nginx config files ?
SETUP_NGINX=true

# Shall we install apache config files ?
SETUP_APACHE=false

# Shall we use sentry ?
# if so sentry-cli is required !!!!
USE_SENTRY=true

# Special conf for demo
if [ $ENVIRONMENT == "demo" ]; then
  SETUP_NGINX=false
  SETUP_APACHE=true
  USE_SENTRY=false
  DEST_PATH="/var/www/static/campulse-demo/"
fi

case "$ENVIRONMENT" in
    test)
        TARGET=("${TEST_HOSTS[@]}")
        HOST="$TEST_NGINX_CONF"
        TARGET_NGINX_CONF="$HOST.conf"
        SOURCE_ENV_FILE=".env.deploy_test"
	;;
    preprod)
        TARGET=("${PREPROD_HOSTS[@]}")
        HOST="$PREPROD_NGINX_CONF"
        TARGET_NGINX_CONF="$HOST.conf"
        SOURCE_ENV_FILE=".env.deploy_pprd"
	;;
    prod)
        TARGET=("${PROD_HOSTS[@]}")
        HOST="$PROD_NGINX_CONF"
        TARGET_NGINX_CONF="$HOST.conf"
        SOURCE_ENV_FILE=".env.deploy_prod"
	;;
    demo)
        TARGET=("${DEMO_HOSTS[@]}")
        HOST="$DEMO_APACHE_CONF"
        TARGET_APACHE_CONF="$HOST.conf"
        SOURCE_ENV_FILE=".env.deploy_demo"
  ;;
esac

echo "ENV : $2"
echo "Branch/Tag : $1"
echo "Target : ${TARGET[@]}"

# Shall we install nginx config ?
if [ "$SETUP_NGINX" == true ]; then
  for i in "${TARGET[@]}"; do
      if ! ssh -q "$i" test -L "/etc/nginx/sites-enabled/$TARGET_NGINX_CONF"; then
        echo "🏗 Setup nginx vhost for $i"
        scp -r "nginx/$TARGET_NGINX_CONF" "$i:/etc/nginx/sites-available/"
        # TODO: using systemctl instead of service ?
        ssh -q "$i" ln -s "/etc/nginx/sites-available/$TARGET_NGINX_CONF /etc/nginx/sites-enabled/$TARGET_NGINX_CONF && service nginx reload"
      else
        for j in "$@"; do
            if [ "$j" == "--update-nginx-conf" ]; then
                echo "🏗 Update nginx vhost for $i"
                scp -r "nginx/$TARGET_NGINX_CONF" "$i:/etc/nginx/sites-available/"
                ssh -q "$i" service nginx reload
            fi
        done
      fi
  done
fi

# Shall we install apache config ?
if [ "$SETUP_APACHE" == true ]; then
  for i in "${TARGET[@]}"; do
      if ! ssh -q "$i" test -L "/etc/apache2/sites-enabled/$TARGET_APACHE_CONF"; then
        echo "🏗 Setup apache vhost for $i"
        scp -r "apache/$TARGET_APACHE_CONF" "$i:/etc/apache2/sites-available/"
        ssh -q "$i" a2ensite "/etc/apache2/sites-available/$TARGET_APACHE_CONF"
        if [ $(apachectl -t) ]; then
            echo "♻️ Reload Apache"
            service apache2 reload
        fi
      else
        for j in "$@"; do
            if [ "$j" == "--update-apache-conf" ]; then
                echo "🏗 Update apache vhost for $i"
                scp -r "apache/$TARGET_APACHE_CONF" "$i:/etc/apache2/sites-available/"
                if [ $(ssh -q "$i" apachectl -t) ]; then
                  echo "♻️ Reload Apache"
                  service apache2 reload
                fi
            fi
        done
      fi
  done
fi

cd "$TEMP"
echo "🔀 Cloning repository on target tag/branch"
git clone -b "$1" --single-branch "$REPOSITORY" "$WORKING_DIR"
cd "$WORKING_DIR"
echo
# Get last commit id
echo "🏗 Installing npm dependencies"
npm ci
echo "📦 Packaging stuff"

# shellcheck source=/dev/null
. "${SOURCE_ENV_FILE}"

npm run build:$ENVIRONMENT
PROJECT_VERSION=$(git describe --always --tags)
# Create info file for app
echo $(printf "$TEMPLATE" "$HOST" "$DISTANT_REPO" "$(whoami)" "$1" "$PROJECT_VERSION") > "dist/${PROJECT}_info.json"
echo "🚀 Deploying files"
for i in "${TARGET[@]}"; do
    echo "Scp files to $i"
    ssh -q "$i" mkdir -p $DEST_PATH
    rsync -avzhe ssh --progress --delete "dist/" "$i:$DEST_PATH"
done

# SENTRY
# Sentry needs gitlab repository to be origin
if [ "$USE_SENTRY" == true ]; then
  echo "🚧 Manipulating git distant repositories"
  git remote remove origin
  git remote add origin "$DISTANT_REPO"
  PROJECT_VERSION=$(git describe --always --tags)
  # Create a release
  echo "📌 Telling about $PROJECT_VERSION to Sentry"
  sentry-cli releases new -p "$PROJECT" "$PROJECT_VERSION"
  # Associate commits with the release
  echo "🤖 Associating commits to version"
  sentry-cli releases set-commits --auto "$PROJECT_VERSION"
  # Declare deployment
  echo "🔖 Telling Sentry that we are deploying $PROJECT_VERSION in $ENVIRONMENT"
  sentry-cli releases deploys "$PROJECT_VERSION" new -e "$ENVIRONMENT"
fi

# Clean working dir
cd .. && rm -rf "$WORKING_DIR"
echo "🎉 $PROJECT $PROJECT_VERSION successfully deployed"
