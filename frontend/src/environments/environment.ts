// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

console.log('location.hostname: ', location.hostname);

export const environment = {
  production: false,
  // app: `http://localhost:8100`,
  apiUrl: `http://localhost:9187`,
  urlRTMP: `rtmp://localhost:1941`,
  urlWSS: `ws://localhost:8015`,
  urlNMS: `http://localhost:8015/admin/streams`,
  wsEndpoint: 'ws://localhost:5556/ws/',
  RTCPeerConfiguration: {
    iceServers: [
      {        
        urls: 'turn:192.158.29.39:3478?transport=tcp',
        username: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        credential: '28224511:1379330808'
      }
    ]
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
