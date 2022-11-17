FROM node:latest
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE  3003 3003

RUN npm install nodemon -g

CMD [ "nodemon" ]