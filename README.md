# clive
```
In root
$ npm install

In frontend directory
$ npm install
```

```
"NMS":
$ node nms/app.js
```
```
IN "FRONTEND" DIRECTORY:
$ ionic build
```
```
IN "ROOT" DIRECTORY:
$ npm run backend:build
$ node build/server.js
```
```
IN "FRONTEND" DIRECTORY:
$ pm2 start nms/app.js
$ pm2 start build/server.js
```

---

<<<<<<< HEAD
# frontend-angular-ionic-docker

## Docker section
```bash
# Docker stop e remove (in root)
$ docker stop $(docker ps -a -q)
$ docker rm $(docker ps -a -q)

# DOCKER DEPLOY (in root)
$ docker network create proxy (docker network ls, docker network prune)
## Docker for developer mode in local
$   

=======
## frontend-angular-ionic-docker
```bash
ionic build (for develop)
ionic build --prod (for production)
```

# Working environment section

### DEVELOP MODE
```bash
## docker network
$ docker network create proxy

## Docker for developer mode in dev-local (only db-mysql and phpmyadmin)
$ docker compose -f docker-compose-local.yml --env-file ./.env up

## start Node Media Server
$ node nms/app.js

## start backend in watch mode
$ npm run watch

## start frontend in watch mode
$ cd frontend && ionic serve
```

### PRODUCTION MODE
```bash
## docker network
$ docker network create proxy

## backend build
$ tsc --build

## frontend build
$ cd frontend && ionic build --prod

## Docker for production model
$ IMAGE=clive:clive TARGET=production docker compose -f docker-compose.yml --env-file ./.env up
>>>>>>> 3880af1447672dd89e3cbc52a027bfc23aad958c
```


