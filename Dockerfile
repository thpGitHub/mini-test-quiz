FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# EXPOSE 2368
EXPOSE 3000

CMD ["npm", "start"]

