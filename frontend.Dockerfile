FROM node:20.10.0
WORKDIR /app
COPY . .
RUN npm install
RUN npm run frontend:postinstall
RUN npm run frontend:build
RUN npm run frontend:generate
EXPOSE 3000
CMD ["npm", "run", "frontend:preview"]