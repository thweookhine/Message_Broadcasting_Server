FROM node:alpine

WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .

EXPOSE 8080

RUN apk add --no-cache bash
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

CMD ["/wait-for-it.sh", "postgres:5432", "--", "npm", "run", "dev"]
