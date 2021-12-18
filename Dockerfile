FROM node:lts-alpine3.12
WORKDIR /app
COPY app/index.js .
COPY app/package.json .
RUN npm install
CMD node index.js
EXPOSE 3000 3000
