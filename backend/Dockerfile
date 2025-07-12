FROM node:18

RUN echo $MONGO_URI

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

RUN npm run test

CMD ["npm", "run", "start"]
