### STAGE 1: Build ###
FROM node:14.21.2-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:ssr
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/server.js /usr/share/nginx/html
RUN mkdir -p /usr/share/nginx/html/dist/{server,browser}
COPY --from=build /usr/src/app/dist/server /usr/share/nginx/html/dist/server
COPY --from=build /usr/src/app/dist/browser /usr/share/nginx/html/dist/browser
RUN rm -rf /usr/share/nginx/html/*.html
RUN rm -rf /usr/share/nginx/html/dist/\{server\,browser\}
