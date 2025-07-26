#!/bin/bash

echo "Setting up Docker environment..."

# Pre-pull required images to avoid timeout issues
echo "Pulling Docker images..."
docker pull node:20.11-alpine3.18
docker pull postgres:15-alpine
docker pull rabbitmq:3-management
docker pull redis:7-alpine

echo "Docker images pulled successfully!"
echo "You can now run: docker compose up --build" 