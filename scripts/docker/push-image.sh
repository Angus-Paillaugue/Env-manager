#!/usr/bin/env bash

thisDir=$(dirname $0)
dockerComposeFile="${thisDir}/../../docker-compose.yml"

docker tag env-manager-web anguspllg/env-manager

docker push anguspllg/env-manager
