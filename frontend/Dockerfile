FROM node:18.18.0

WORKDIR /quasar-client
COPY . .
RUN npm install
RUN npm install -g @quasar/cli
RUN quasar build
EXPOSE 4000

CMD ["quasar", "serve", "dist/spa"]
