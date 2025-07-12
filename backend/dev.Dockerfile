FROM node:18

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

USER node

CMD ["npm", "run", "dev", "--", "--host"]