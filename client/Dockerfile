FROM node:16.5.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=prod

COPY . ./

CMD ["npm","run","dev"]
