// ==============================|| THEME CONSTANT ||============================== //

export const APP_DEFAULT_PATH = '/dashboard/default';
export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 60;

export default {
  server: {
    proxy: {
      '/api': 'http://192.168.86.120:8080', // Proxy mọi request đến /api tới backend
    }
  }
};
