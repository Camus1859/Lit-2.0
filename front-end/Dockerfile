FROM node:20-alpine AS builder
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . . 
RUN npm run build


FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=builder /src/src/dist .
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf