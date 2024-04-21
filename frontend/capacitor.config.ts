import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'frontend',
  webDir: 'www',
  // npmClient: 'npm',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
  cordova: {},
};

export default config;

// DEPRECATO capacitor.config.json
// {
//   "appId": "io.ionic.starter",
//   "appName": "frontend",
//   "bundledWebRuntime": false,
//   "npmClient": "npm",
//   "webDir": "www",
//   "plugins": {
//     "SplashScreen": {
//       "launchShowDuration": 0
//     }
//   },
//   "cordova": {}
// }
