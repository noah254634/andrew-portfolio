import axios from 'axios';

export const DEFAULT_RENDER_API_URL = 'https://andrew-portfolio-backend.onrender.com/api/v1';

export const getApiBaseURL = () => {
  const customUrl = localStorage.getItem('custom_api_url');
  if (customUrl) {
    return customUrl.endsWith('/api/v1') ? customUrl : `${customUrl.replace(/\/$/, '')}/api/v1`;
  }

  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) {
    return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl.replace(/\/$/, '')}/api/v1`;
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // Local device testing via LAN IP
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return `${protocol}//${hostname}:8000/api/v1`;
  }

  // Localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000/api/v1';
  }

  // Production Vercel / Cloud Domain -> Fallback to Render Backend
  return DEFAULT_RENDER_API_URL;
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 10000,
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
