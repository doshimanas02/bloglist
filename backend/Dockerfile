FROM node:18

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

RUN npm run test

CMD ["npm", "run", "start"]
