FROM node:22-alpine AS build
WORKDIR /app

ARG VITE_USERS_API_URL=http://localhost:8081/api
ENV VITE_USERS_API_URL=$VITE_USERS_API_URL
ARG VITE_KPIS_API_URL=http://localhost:8000/api/kpis
ENV VITE_KPIS_API_URL=$VITE_KPIS_API_URL

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
