FROM node:18

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

RUN npm run test

RUN echo $MONGO_URI

CMD ["npm", "run", "start"]
