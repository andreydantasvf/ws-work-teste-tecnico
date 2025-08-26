FROM node:22.18-alpine AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm install

FROM dependencies AS build
COPY . .
RUN npm run build

FROM base AS deploy
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["npm", "run", "start"]

FROM dependencies AS dev
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]
