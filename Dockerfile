ARG NODE_ENV=production
ARG RUN_CMD="node dist/main"

# Стадия для сборки (builder stage)
FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Стадия для продакшена (production stage)
FROM node:18 AS production-stage
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
RUN if [ "$NODE_ENV" = "production" ]; then npm install --only=production; fi
EXPOSE 3000
CMD ${RUN_CMD}

# Стадия для тестирования (test stage)
FROM node:18 AS test
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install

RUN apt-get update && apt-get install -y docker-compose

CMD ["npm", "run", "test:e2e"]
