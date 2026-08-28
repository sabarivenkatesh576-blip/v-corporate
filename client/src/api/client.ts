import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Local / LAN testing only
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('10.') || host.startsWith('192.168.')) {
      return `http://${host}:5000/api`;
    }
  }
  // Production / Vercel / Render cloud
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vcorp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.startsWith('/verify')) {
        // Session handling
      }
    }
    return Promise.reject(error);
  }
);

export default api;
