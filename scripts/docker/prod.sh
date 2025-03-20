#!/usr/bin/env bash

thisDir=$(dirname $0)
dockerComposeFile="${thisDir}/../../docker-compose.yml"


if [ ! -f "$dockerComposeFile" ]; then
  echo "Error: Docker Compose file not found at $dockerComposeFile"
  exit 1
fi

docker compose -f "$dockerComposeFile" up -d
