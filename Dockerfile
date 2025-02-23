FROM node:lts AS build-stage
ARG VUE_APP_BACKEND_URL
ENV VUE_APP_BACKEND_URL=${VUE_APP_BACKEND_URL}
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx AS production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80