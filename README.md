# clive

### DEVELOP MODE
```bash
## Docker network
$ docker network create proxy

## Docker for developer mode in dev-local (only db-mysql and phpmyadmin)
$ docker compose -f docker-compose-local.yml --env-file ./.env up

## start Node Media Server
$ node nms/app.js

## start backend in watch mode
$ npm install
$ npm run watch

## start frontend in watch mode
$ npm install --legacy-peer-deps
$ cd frontend && ionic serve
```

### PRODUCTION MODE
```bash
## backend build
$ tsc --build

## frontend build
$ cd frontend && ionic build --prod

## docker network
$ docker network create proxy

## Docker for create image app in mode production
$ IMAGE=clive:clive TARGET=production docker compose -f docker-compose.yml --env-file ./.env up

## Push image container app in dockerhub:
$ docker login -u "francesco.re69@gmail.com" -p "Lillone19" docker.io
$ docker build --target production -t 3481974/clive:clive .
$ docker push docker.io/3481974/clive:clive
```


