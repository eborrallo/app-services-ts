#!/usr/bin/env bash

set -Eeuo pipefail

echo "*** Waiting for Cloudserver to become available ..."

while ! aws s3 ls --endpoint-url=${ENDPOINT:-http://s3.docker.test:8000} &> /dev/null; do
    sleep 1
done

echo "*** Connected with Cloudserver."

aws --endpoint-url=${ENDPOINT:-http://s3.docker.test:8000} s3 mb s3://mybucket
