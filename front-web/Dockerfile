FROM node:22-alpine AS build
WORKDIR /app

ARG REACT_APP_BFF_API_URL=http://localhost:8000
ENV REACT_APP_BFF_API_URL=$REACT_APP_BFF_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
