FROM node:12-alpine

WORKDIR /app
COPY . .
WORKDIR /app/server
CMD [ "npm", "run", "start:dev"]
EXPOSE 8080