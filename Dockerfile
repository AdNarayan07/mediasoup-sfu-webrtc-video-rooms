FROM node:12

WORKDIR /app
RUN apt-get update
RUN npm install
COPY package-lock.json .
COPY package.json .

COPY src src
COPY ssl ssl
COPY public public

EXPOSE 3016
EXPOSE 10000-10100

RUN npm i -g nodemon

CMD npm start