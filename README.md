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

```


