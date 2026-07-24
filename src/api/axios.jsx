import axios from 'axios';

export const getApiBaseURL = () => {
  const customUrl = localStorage.getItem('custom_api_url');
  if (customUrl) {
    return customUrl.endsWith('/api/v1') ? customUrl : `${customUrl.replace(/\/$/, '')}/api/v1`;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // If accessing from phone/device via LAN IP (e.g. 192.168.x.x:5173 -> target port 8000)
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return `${protocol}//${hostname}:8000/api/v1`;
  }

  // If accessing via ngrok or custom domain
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `${window.location.origin}/api/v1`;
  }

  return 'http://127.0.0.1:8000/api/v1';
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseURL();
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
