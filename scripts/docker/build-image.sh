#!/usr/bin/env bash

thisDir=$(dirname $0)
dockerComposeFile="${thisDir}/../../docker-compose.yaml"

docker compose -f ${dockerComposeFile} build
