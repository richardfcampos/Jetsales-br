# Use official Node.js LTS image
FROM node:20-alpine

# Set npm configuration for better network resilience
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

WORKDIR /app

# Install bash first
RUN apk add --no-cache bash

# Copy package files
COPY package*.json ./

# Install dependencies with retry logic
RUN npm install --omit=dev --no-audit --no-fund || \
    (sleep 10 && npm install --omit=dev --no-audit --no-fund) || \
    (sleep 20 && npm install --omit=dev --no-audit --no-fund)

# Copy wait-for-it script
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Copy source code
COPY . .

EXPOSE 3000
