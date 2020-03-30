#!/bin/bash
set -ev
docker build -t one-app:at-test .
npm run build:sample-modules -- --archive-built-artifacts --bundle-statics-origin=$SURGE_DOMAIN
echo '*' >> sample-module-bundles/CORS && \
npx surge teardown $SURGE_DOMAIN --token $SURGE_TOKEN && \
npx surge sample-module-bundles $SURGE_DOMAIN --token $SURGE_TOKEN && \
docker login -u=$HEROKU_DOCKER_USERNAME -p=$HEROKU_API_KEY registry.heroku.com && \
docker tag one-app:at-test registry.heroku.com/one-app-integration-test/web && \
docker push registry.heroku.com/one-app-integration-test/web && \
npx heroku container:release web -a one-app-integration-test && \
ONE_DANGEROUSLY_SKIP_ONE_APP_IMAGE_BUILD=true npm run test:integration -- --remote-one-app-environment=https://one-app-integration-test.herokuapp.com
