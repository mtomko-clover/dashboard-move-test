FROM node:latest

RUN mkdir -p /usr/src/dashboard
WORKDIR /usr/src/dashboard
COPY package*.json /usr/src/dashboard/
RUN npm install

COPY . /usr/src/dashboard
RUN npm run build

ENV NODE_ENV production

EXPOSE 3001
CMD ["npm", "start"]