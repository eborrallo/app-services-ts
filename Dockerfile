FROM node:21.6-slim

WORKDIR /code

COPY package.json ./
COPY package-lock.json ./

RUN npm install --global copy
RUN npm install
