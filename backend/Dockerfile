# Use official Node.js LTS image
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

RUN apk add --no-cache bash

COPY wait-for-it.sh ./

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
