console.log('location.hostname: ', location.hostname);

export const environment = {
  production: true,
  // app: 'http://localhost:9419',
  apiUrl: 'http://212.227.29.217:9187',
  urlRTMP: 'rtmp://212.227.29.217:1941',  
  urlWSS: 'wss://212.227.29.217:8471',
  urlNMS: `http://212.227.29.217:8471/admin/streams`,
  wsEndpoint: 'ws://212.227.29.217:5556/ws/',
  RTCPeerConfiguration: {
    iceServers: [
      {
        urls: 'turn:turnserver:3478',
        username: 'user',
        credential: 'password'       
      }
    ]
  }
};
