import axios from 'axios';

export const DEFAULT_RENDER_API_URL = 'https://andrew-portfolio-backend-z42h.onrender.com/api/v1';

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

  // Production Vercel / Cloud Domain -> Fallback to Actual Render Backend URL
  return DEFAULT_RENDER_API_URL;
};

// Formats image URLs dynamically & compresses Unsplash raw images to 800px WebP to prevent mobile RAM/GPU freezing
export const formatImageUrl = (url) => {
  if (!url) return '';
  if (url.includes('images.unsplash.com') && !url.includes('w=')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format&fit=crop&w=800&q=85`;
  }
  if (url.startsWith('http://127.0.0.1:8000') || url.startsWith('http://localhost:8000')) {
    const relativePath = url.replace(/^http:\/\/(127\.0\.0\.1|localhost):8000/, '');
    const apiBase = getApiBaseURL().replace(/\/api\/v1\/?$/, '');
    return `${apiBase}${relativePath}`;
  }
  if (url.startsWith('/static/')) {
    const apiBase = getApiBaseURL().replace(/\/api\/v1\/?$/, '');
    return `${apiBase}${url}`;
  }
  return url;
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
