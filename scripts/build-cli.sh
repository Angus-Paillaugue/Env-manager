#!/usr/bin/env bash

thisDir=$(dirname $0)
cliEntrypointLocation="${thisDir}/../cli/cli.ts"
output="${thisDir}/../dist/env-manager"
bun build "$cliEntrypointLocation" --compile --minify --outfile "$output"
