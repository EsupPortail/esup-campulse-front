#!/bin/bash
set -e

PROJECT="plan-a-front"

if [ ! $# -ge 2 ]; then
  echo "👉 Usage: $0 branch/tag test|preprod|prod [--update-nginx-conf] [--maintenance]"
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

# Json info file template
TEMPLATE='{"info":{"app_host":"%s","repo_url":"%s","local_user":"%s","tag":"%s","commit_id":"%s"}}'

# Set env
ENVIRONMENT="$2"

# Shall we install nginx config files ?
SETUP_NGINX=true

# Shall we use sentry ?
# if so sentry-cli is required !!!!
USE_SENTRY=true

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

cd "$TEMP"
echo "🔀 Cloning repository on target tag/branch"
git clone -b "$1" --single-branch "$REPOSITORY" "$WORKING_DIR"
cd "$WORKING_DIR"

for i in "$@"; do
  if [ "$i" == "--maintenance" ]; then
      echo "🚀 Deploying maintenance page"
      for j in "${TARGET[@]}"; do
          echo "Scp files to $j"
          ssh -q "$j" mkdir -p $DEST_PATH
          rsync -avzhe ssh --progress --delete "maintenance/" "$j:$DEST_PATH"
      done
      exit 0
  fi
done

echo "🏗 Installing pnpm dependencies"
pnpm install --frozen-lockfile
echo "📦 Packaging stuff"

# shellcheck source=/dev/null
. "${SOURCE_ENV_FILE}"

pnpm run build:$ENVIRONMENT
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
