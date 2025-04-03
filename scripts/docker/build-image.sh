#!/usr/bin/env bash

thisDir=$(dirname $0)
dockerComposeFile="${thisDir}/../../docker-compose.yml"

docker compose -f ${dockerComposeFile} build
