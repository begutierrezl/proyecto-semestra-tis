FROM node:24.21.0-alpine
WORKDIR /client

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9000

CMD ["npm", "run", "dev"]

