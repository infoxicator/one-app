#!/bin/bash
set -ev
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push infoxicator/one-app-test:v5.0.8
