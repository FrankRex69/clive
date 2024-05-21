console.log('location.hostname: ', location.hostname);

export const environment = {
  production: true,
  // app: 'http://localhost:9419',
  apiUrl: 'https://frx-tech.com:9187',
  urlRTMP: 'rtmp://frx-tech.com:1941',  
  urlWSS: 'wss://frx-tech.com:8471',
  urlNMS: `https://frx-tech.com:8471/admin/streams`,
  wsEndpoint: 'wss://frx-tech.com:5556/ws/',
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
