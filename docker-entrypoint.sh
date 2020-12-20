#!/bin/sh
until hasura migrate apply --endpoint http://hasura:8080; do
    sleep 5
done
hasura metadata apply --endpoint http://hasura:8080

exec "$@"
