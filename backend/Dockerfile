FROM node:20.10.0
ENV NODE_OPTIONS="--max-old-space-size=4096"
COPY . .
RUN npm install
RUN npm run backend:build
EXPOSE 3000
CMD ["npm", "run", "backend:production"]
