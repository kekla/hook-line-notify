FROM node:lts-alpine3.12
WORKDIR /app
ENV EXTERNAL_API_PATH=""
ENV EXTERNAL_API_REQUIRED_PARAM=""
ENV DOOR_API_HOST=""
ENV DOOR_API_PATH=""
ENV RELAY_LINE_API_PATH=""
ENV LINE_TOKEN=""
COPY app/index.js .
COPY app/package.json .
COPY app/private-key.pem .
COPY app/cert.pem .
RUN npm install
CMD node index.js
EXPOSE 3000 3001
