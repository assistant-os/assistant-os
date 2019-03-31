# https://github.com/mhart/alpine-node
FROM mhart/alpine-node:10

WORKDIR /app

COPY packages packages
COPY scripts scripts
COPY webpack.config.js .
COPY lerna.json .
COPY package.json .
COPY yarn.lock .

ENV PORT=8080

RUN npx lerna bootstrap
RUN yarn webpack

RUN rm -rf packages
CMD ["node", "dist/app.js"]

EXPOSE 8080/tcp
