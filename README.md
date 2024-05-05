# Testing Lab

## docker compose

* 檔名: `docker-compose.yaml`
* 可正常操作前端
* 可正常寫入 DB
* 重新啟動後 PV 資料還在

```
$ docker compose up --build
```

## k8s execute

```
# build image
$ docker compose build
$ kubectl apply -f k8s/deployment.yaml
$ kubectl apply -f k8s/service.yaml
```

## Backend

Fastify Server

### Set your environment variable

```
cd backend
cp .env.sample .env
```

### Development

Run a mongo container
```
docker run -d -p 27017:27017 mongo
```

Install dependencies
```
npm install
```

Start development mode
```
npm run dev
```

### Run the test

```
npm run test
```

## Frontend

React (by vite)

### Development

Install dependencies
```
npm install
```

Start development mode
```
cd frontend
npm run dev
```

Visit
http://localhost:5173

### Run cypress test

```
npm run cy:test
```
