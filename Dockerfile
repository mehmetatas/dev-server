FROM node

EXPOSE 8080

COPY package.json /server/package.json
COPY server.js /server/server.js

WORKDIR /server

RUN npm install

CMD ["node", "server.js"]