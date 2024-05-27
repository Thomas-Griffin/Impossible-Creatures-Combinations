FROM node:20.10.0
ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "backend:production"]


