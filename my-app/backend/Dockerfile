FROM node:16 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run test

FROM node:16

WORKDIR /usr/src/app

COPY --from=test-stage /usr/src/app .

CMD ["npm", "start"]