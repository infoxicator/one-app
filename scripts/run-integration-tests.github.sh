#!/bin/bash
set -ev
#docker build -t one-app:at-test .
#npm run build:sample-modules -- --archive-built-artifacts --bundle-statics-origin=$SURGE_DOMAIN
#echo $HEROKU_APP_URL >> sample-module-bundles/CORS && \
#npx surge teardown $SURGE_DOMAIN --token $SURGE_TOKEN && \
#npx surge sample-module-bundles $SURGE_DOMAIN --token $SURGE_TOKEN && \
#docker login -u=$HEROKU_DOCKER_USERNAME -p=$HEROKU_API_KEY registry.heroku.com && \
#docker tag one-app:at-test registry.heroku.com/$HEROKU_APP_ID/web && \
#docker push registry.heroku.com/$HEROKU_APP_ID/web && \
#npx heroku container:release web -a $HEROKU_APP_ID && \
ONE_DANGEROUSLY_SKIP_ONE_APP_IMAGE_BUILD=true npm run test:integration -- --remote-one-app-environment=$HEROKU_APP_URL
