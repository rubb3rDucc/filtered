FROM node:18

RUN mkdir -p /usr/app
WORKDIR /usr/app/ 

COPY package*.json .
RUN npm ci

# USER node
COPY . .
EXPOSE 8080

# RUN ls -la

# ENV NODE_ENV production
CMD [ "node", "src/server.js" ]
# USER node