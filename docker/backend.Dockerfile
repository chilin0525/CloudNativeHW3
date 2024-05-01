FROM node:21

WORKDIR /app
COPY ./backend .
RUN cp .env.sample .env

RUN npm install

EXPOSE 8888

CMD ["node", "dist/index.js"]