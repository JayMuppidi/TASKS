# Dockerfile for React client

# Build react client
FROM node:20.3-alpine

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

###  Installing dependencies

RUN npm install --silent

# copy local files to app folder
COPY . .

EXPOSE 8000

CMD ["npm","start"]