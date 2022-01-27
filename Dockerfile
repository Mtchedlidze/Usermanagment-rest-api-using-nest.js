FROM node:17-alpine3.12

WORKDIR /app

COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci

COPY ./dist .

CMD [ "node", "./main.js" ]
