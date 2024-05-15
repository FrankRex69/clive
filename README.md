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

## frontend-angular-ionic-docker
```bash
ionic build (for develop)
ionic build --prod (for production)
```

## Docker section
```bash
# Docker stop e remove (in root)
$ docker stop $(docker ps -a -q)
$ docker rm $(docker ps -a -q)

# DOCKER DEPLOY (in root)
$ docker network create proxy (docker network ls, docker network prune)
## Docker for developer mode in dev-local
$ docker compose -f docker-compose-local.yml --env-file ./.env up
## Docker for production model
$ IMAGE=clive:clive TARGET=local docker compose -f docker-compose.yml --env-file ./.env up
```


