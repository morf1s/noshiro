FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache build-base g++ python3 git
RUN npm install -g typescript pnpm

COPY package.json .
RUN pnpm install

COPY . .

RUN pnpm build

## final contianer
FROM node:18-alpine AS final

WORKDIR /app

RUN apk add --no-cache build-base g++ python3 git
RUN npm i -g pnpm

COPY package.json .
RUN pnpm install

COPY --from=builder /app/dist ./dist

CMD [ "node", "." ]