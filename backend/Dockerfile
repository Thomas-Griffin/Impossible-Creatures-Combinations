FROM node:18.18.0
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /express-server
COPY . .
RUN npm install
EXPOSE 3000

CMD ["npm", "run", "server"]