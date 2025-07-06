#!/bin/bash

echo "Starting Bookmark Manager"

if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo "Error: Neither 'docker-compose' nor 'docker compose' is available"
    exit 1
fi

echo "Using $DOCKER_COMPOSE_CMD"

$DOCKER_COMPOSE_CMD down
$DOCKER_COMPOSE_CMD up -d --build

echo "To stop the app, run: $DOCKER_COMPOSE_CMD down"
