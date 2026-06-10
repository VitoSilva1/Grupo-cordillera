FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build && npm prune --omit=dev

EXPOSE 8000

CMD ["npm", "start"]
