FROM node:alpine

WORKDIR '/solai production'

COPY package.json .
RUN npm install
COPY . .
CMD [ "nodemon" ]