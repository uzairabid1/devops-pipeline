FROM node:18

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install -g pm2
RUN npm install

COPY frontend ./

CMD ["pm2-runtime", "npm", "--", "start"]