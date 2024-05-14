console.log('location.hostname: ', location.hostname);

export const environment = {
  production: true,
  // app: 'http://localhost:9419',
  apiUrl: 'http://212.227.29.217:9999',
  urlRTMP: 'rtmp://212.227.29.217:1949',  
  urlWSS: 'ws://212.227.29.217:8479',
  urlNMS: `http://212.227.29.217:8479/admin/streams`,
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
