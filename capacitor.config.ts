import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mac.wss.mobile',
  appName: 'MacWSS Meter',
  webDir: 'www',
  server: {
    androidScheme: 'http'
  }
};

export default config;
