FROM node:22-alpine AS build
WORKDIR /app

ARG VITE_USERS_API_URL=/api/auth
ARG VITE_USER_API_URL=/api/users
ENV VITE_USERS_API_URL=$VITE_USERS_API_URL
ENV VITE_USER_API_URL=$VITE_USER_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
