FROM node:20.10.0 as build-stage

WORKDIR /combinations-client
COPY . .
RUN npm install
RUN npm install -g @quasar/cli
RUN quasar build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /combinations-client/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
