FROM node:20.10.0
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /combinations-server
COPY . .
RUN npm install
RUN npm install ts-node -g
EXPOSE 3000

CMD ["npm", "run", "backend:production"]