FROM node:12

MAINTAINER Saurabh Srivastava (saurass.in)
WORKDIR /tinyurl-worker
COPY package*.json ./

RUN npm install
COPY . .

CMD ["node", "index.js"]