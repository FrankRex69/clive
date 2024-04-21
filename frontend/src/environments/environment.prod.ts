console.log('location.hostname: ', location.hostname);

export const environment = {
  production: true,
  app: 'https://www.collaudolive.com:9419',
  apiUrl: 'https://www.collaudolive.com:9999',
  urlRTMP: 'rtmp://www.collaudolive.com:1949',
  urlWSS: 'wss://www.collaudolive.com:8479',
  urlNMS: `https://www.collaudolive.com:8479/admin/streams`,
  wsEndpoint: 'wss://www.collaudolive.com:5556/ws/',
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
