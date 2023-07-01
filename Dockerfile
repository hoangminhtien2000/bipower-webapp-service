FROM node:16.15.0 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install npm@8.5.5 -g
RUN npm install --force
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY vhost.conf /etc/nginx/nginx.conf
#