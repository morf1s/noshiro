FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache build-base g++ python3 git
RUN npm install -g typescript pnpm

COPY package.json .
RUN pnpm install

COPY . .

RUN pnpm build
RUN pnpm postbuild

## final contianer
FROM node:18-alpine AS final

WORKDIR /app

RUN npm i -g pnpm

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./dist/node_modules

CMD [ "node", "./dist/index.js" ]