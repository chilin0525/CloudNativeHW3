FROM node:21

WORKDIR /app
COPY ./backend .
RUN cp .env.sample .env

RUN npm install
RUN npm run build

EXPOSE 8888

CMD ["npm", "run", "start"]
# CMD ["sleep", "2000"]