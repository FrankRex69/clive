# ChatOperativa - SmartCollaudo

## TODO: Build Android

## Socket.IO in Angular

🔗 [How To Create a Real-Time App with Socket.IO, Angular, and Node.js](https://www.digitalocean.com/community/tutorials/angular-socket-io)

🔗 [Creating a Real time chat app with Angular and Socket.io with NodeJS](https://deepinder.me/creating-a-real-time-app-with-angular-8-and-socket-io-with-nodejs/)

🔗 [Setting up and creating a chat app with Angular, Socket.IO 3.0, and Express](https://medium.com/@deguzmanbrianfrancis/setting-up-and-creating-a-chat-app-with-angular-socket-io-3-0-and-express-70c69b8031f6)

Install [ngx-socket-io](https://www.npmjs.com/package/ngx-socket-io), an Angular wrapper over socket.io client libraries and/or [socket-io.client](https://www.npmjs.com/package/socket.io-client), the code for the client-side implementation of socket.io.

```
npm install ngx-socket-io@4.0.0 -S
```

In _app.module.ts_, configure SocketIoModule module using the object config of type SocketIoConfig: this object accepts two optional properties they are the same used in the server side io(url[, options]).

```ts
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

const config: SocketIoConfig = { url: "http://localhost:4444", options: {} };

@NgModule({
  imports: [SocketIoModule.forRoot(config)],
})
```

**This will fire off the connection to our socket server as soon as AppModule loads**

The SocketIoModule provides now a **configured Socket service** that can be **injected anywhere** inside the AppModule.

```ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatService {
  constructor(private socket: Socket) {}

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data) => data.msg));
  }
}
```

Using multiple sockets with different end points
In this case we do not configure the SocketIoModule directly using forRoot. What we have to do is: extend the Socket service, and call super() with the SocketIoConfig object type (passing url & options if any).

```ts
import { Injectable, NgModule } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketOne extends Socket {
  constructor() {
    super({ url: 'http://url_one:portOne', options: {} });
  }
}

@Injectable()
export class SocketTwo extends Socket {
  constructor() {
    super({ url: 'http://url_two:portTwo', options: {} });
  }
}

@NgModule({
  imports: [SocketIoModule],
  providers: [SocketOne, SocketTwo],
})
export class AppModule {}
```

**Now you can inject SocketOne, SocketTwo in any other services and / or components**

❗ Know Issue For error TS2345 --> Add this to the app's _tsconfig.json_:

```
"compilerOptions": {
  "paths": {
    "rxjs": ["./node_modules/rxjs"]
  }
}
```

❗ Build Warning: "ngx-socket-io.js depends on 'socket.io-client'. CommonJS or AMD dependencies can cause optimization bailouts" --> Add this to the app's _angular.json_:

```
"build": {
  "options": {
    "allowedCommonJsDependencies": ["socket.io-client"],
  }
}
```

---

## MediaDevices

🔗 [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

🔗 [MediaStreamTrack.stop()](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop)

```ts
navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    /* use the stream */
  })
  .catch((err) => {
    /* handle the error */
  });
```

---

## MediaRecorder in Angular

🔗 [How can I use a MediaRecorder object in an Angular2 application?](https://stackoverflow.com/questions/40051818/how-can-i-use-a-mediarecorder-object-in-an-angular2-application)

🔗 [MediaRecorder WebAPI example (Developer Mozzilla)](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

🔗 [Use external javaScript library in angular application](https://stackoverflow.com/questions/44945766/use-external-javascript-library-in-angular-application/63867035#6386703)

You can now add types for MediaRecorder even easier, just install [@types/dom-mediacapture-record](https://www.npmjs.com/package/@types/dom-mediacapture-record) through npm (on _dependencies_ **NOT** _devDependencies_ ❗)

```
npm install @types/dom-mediacapture-record@1.0.7 -S
```

Then modify "compilerOptions" on _tsconfig.app.json_ to specify which types to use in the app.

```
"compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": ["node", "dom-mediacapture-record"]
  },
```

---

## Flv.js in Angular

Install [flv.js](https://www.npmjs.com/package/flv.js), HTML5 Flash Video (FLV) Player written in pure JavaScript without Flash.

```
npm install flv.js@1.5.0 -D
```

And import FlvJs in test-stream.page.ts:

```ts
import FlvJs from 'flv.js';
```

Now you can use FlvJs.Player a type and to create a Player

```ts
player: FlvJs.Player;

this.player = FlvJs.createPlayer(
  {
    type: 'flv',
    url: `${this.urlWSS}${this.suffix}.flv`,
  },
  {
    enableWorker: false,
    enableStashBuffer: false,
    stashInitialSize: 1,
    isLive: true,
    autoCleanupSourceBuffer: true,
  }
);
```

🔗 https://github.com/Bilibili/flv.js

> For FLV live stream playback, please consider [mpegts.js](https://github.com/xqq/mpegts.js) which is under active development.
>
> This project will become **rarely maintained**.

---

## Streaming RTMP Node.js/Angular

🐞 https://developers.google.com/web/updates/2017/06/play-request-was-interrupted

> "_Uncaught (in promise) DOMException: The play() request was interrupted by a call to pause()._"

The [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) interface adds to HTMLElement the properties and methods needed to support basic media-related capabilities that are common to audio and video. The HTMLVideoElement and HTMLAudioElement elements both inherit this interface.

🔗 [Optimizing HTML5 Video Streaming [Updated for 2021]](https://www.dacast.com/blog/optimizing-html5-video-streaming/):

> Native HTML5 video doesn’t support RTMP app streaming nor HDS protocols. However, JW does support these two protocols. So, as mentioned above, if you plan to use a solely HTML5 video player, HLS is probably the best protocol for you.

🔗 [video.js](https://www.npmjs.com/package/video.js): video player HTML5 open source

- https://opensource.com/article/20/2/video-streaming-tools
- https://docs.videojs.com/tutorial-angular.html

> [How can I play RTMP video in Video.js?](https://docs.videojs.comtutorial-faq.html#q-how-can-i-play-rtmp-video-in-videojs)
> It is no longer possible to play RTMP as it requires Flash, andFlash has reached end of life. No browser supports it.

🔗 [flvplayer](https://www.npmjs.com/package/flvplayer) ?

🔗 [node-media-server](https://www.npmjs.com/package/node-media-server): libreria base per pubblicare uno stream

- https://github.com/dougsillars/browserLiveStream
- https://www.fatalerrors.org/a/0t590jE.html

🔗 [socket.io](https://www.npmjs.com/package/socket.io): libreria base per connessione socket

- https://www.digitalocean.com/community/tutorials/angular-socket-io
- https://javascript-conference.com/blog/real-time-in-angular-a-journey-into-websocket-and-rxjs/
- https://blog.briebug.com/blog/making-use-of-websockets-in-angular

### Altri spunti:

🔗 [api.video integration with Ionic?](https://community.api.video/t/integration-with-ioni/2154/7)

🔗 [Not able to Show live camera RTSP streaming with Angular](https://stackoverflow.com/questions/58899464/not-able-to-show-live-camera-rtsp-streaming-with-angular)

🔗 [How to stream rtmp in angular 6 or in HTML](https://stackoverflow.com/questions/56439937/how-to-stream-rtmp-in-angular-6-or-in-html-5)

🔗 [How to stream a .m4v video with NodeJS](https://stackoverflow.com/questions/46625044/how-to-stream-a-m4v-video-with-nodejs)

🔗 [document.getElementById replacement in angular4 / typescript?](https://stackoverflow.com/questions/48226868/document-getelementbyid-replacement-in-angular4-typescript/48226955)

🔗 [Playing HTML 5 video from Angular 2 Typescript](https://stackoverflow.com/questions/40360174/playing-html-5-video-from-angular-2-typescript)

### Using the Camera in Ionic

🔗 [Creating a Custom Camera Preview Overlay with Ionic & Capacitor](https://www.youtube.com/watch?v=JA8k738i9jQ)

🔗 [How Capture, Save and Play Videos with Capacitor inside PWAs](https://www.youtube.com/watch?v=cKmCLenu_YI)

🔗 [How to Build Ionic Media Streaming (Video & Audio)](https://www.youtube.com/watch?v=AyS3uw7HZOM)

🔗 [How to create a live broadcasting app using Cordova and Ionic Framework](https://bambuser.com/docs/broadcasting/cordova/)

🔗 Cordova Streaming Media: https://ionicframework.com/docs/native/streaming-media

🔗 Cordova Camera Preview: https://ionicframework.com/docs/native/camera-preview

---

## [Camera app tutorial](https://ionicframework.com/docs/angular/your-first-app)

Install [native-run](https://www.npmjs.com/package/native-run), used to run native binaries on devices and simulators/emulators, and [cordova-res](https://www.npmjs.com/package/cordova-res), used to generate native app icons and splash screens:

```
npm i native-run
npm i cordova-res
```

Add [Capacitor](https://capacitorjs.com/docs/getting-started/with-ionic) for native functionality

```
npm install @capacitor/core @capacitor/cli
+ @capacitor/core@3.0.0
+ @capacitor/cli@3.0.0

ionic integrations enable capacitor
[INFO] Integration capacitor already enabled.
```

Next we'll need to install the necessary Capacitor plugins to make the app's native functionality work:

```
npm install @capacitor/camera @capacitor/storage @capacitor/filesystem -D
+ @capacitor/filesystem@1.0.0
+ @capacitor/storage@1.0.0
+ @capacitor/camera@1.0.0
```

Some Capacitor plugins, including the Camera API, provide the web-based functionality and UI via the Ionic PWA Elements library.

```
npm install @ionic/pwa-elements -D
+ @ionic/pwa-elements@3.0.2
```

import @ionic/pwa-elements by editing src/main.ts

```ts
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);
```

Crea una pagina vuota Camera

```ts
  async requestOpenCamera() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
  }
```

---

## Configurazione Prettier

Sulla progetto chat-operativa ho installato [prettier](https://prettier.io/docs/en/configuration.html), un formattatore automatico, e ho configurato [husky](https://typicode.github.io/husky/#/?id=create-a-hook) insieme a [pretty-quick](https://github.com/azz/pretty-quick) per formattare in automatico i file prima di ogni commit: husky crea un hook prima di ogni commit; pretty-quick formatta in automatico tutti i file aggiunti al commit.

Ci sono 3 nuove dipendenze (la prima volta andranno installate con "_npm i_"), 3 nuovi script sul package.json e una nuova cartella _.husky_ con dei file di configurazione.

Il file di configurazione di Prettier invece è dentro al frontend: _.prettierrc_.
Tutte le operazioni di formattazione intervengono solo sul frontend e non modificano in alcun modo il backend (@Frex interessa?). Installando l'estensione [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) il codice verrà formattato secondo le regole impostate sul file di configurazione generale (Settings -> Text Editor -> **Default Formatter: Prettier** + **Format On Save**).

Le guide che ho seguito:

- https://dandawsonbrown.com/blog/setup-prettier-in-an-angular-cli-project/
- https://levelup.gitconnected.com/setup-prettier-on-angular-in-30-minutes-12b2ed85e7b7

## Primo accesso alla repository

```shell
# clona la repository
git clone https://github.com/tinatotty91/chat-operativa.git

# entra nella cartella creata
cd chat-operativa

# crea un branch locale "sviluppo" e aggiorna il progetto
git checkout -b sviluppo
git pull origin sviluppo

# DENTRO CHAT-OPERATIVA: installa i node_modules del backend
npm i

# entra nella cartella frontend
cd frontend

# DENTRO FRONTEND: installa node_modules del frontend
npm i

# apri VSCode
code .

# Se non ci sono errori, servi l'app del frontend
ionic serve
```

## Endpoints

```xml
<!-- ESEMPIO -->
```
