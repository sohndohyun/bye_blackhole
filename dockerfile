FROM node:12-alpine

WORKDIR /app
COPY ./app .

RUN npm install
RUN npm install -g typescript
RUN npm install --save-dev nodemon ts-node @types/pg
RUN npm install @types/express sequelize dotenv
CMD [ "npm", "start"]
EXPOSE 3000