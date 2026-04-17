#!/bin/bash

NETWORK_NAME="shared-net"

# Проверка дали мрежата вече съществува
if ! docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
  echo "Creating Docker network: $NETWORK_NAME"
  docker network create --driver bridge "$NETWORK_NAME"
else
  echo "Docker network '$NETWORK_NAME' already exists"
fi