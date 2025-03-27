#!/usr/bin/env bash

thisDir=$(dirname $0)
cliEntryFile="$thisDir/../../cli/cli.ts"
outFile="$thisDir/../../dist/cli"

bun build "$cliEntryFile" --compile --outfile "$outFile"
