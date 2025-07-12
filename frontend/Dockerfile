FROM node:18

RUN echo $VITE_BACKEND_URL

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

CMD ["npm","run","build"]