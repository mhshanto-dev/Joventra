import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hireloop_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh-token')) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        if (data.success && data.data?.token) {
          localStorage.setItem('hireloop_token', data.data.token);
          originalRequest.headers.Authorization = `Bearer ${data.data.token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('hireloop_token');
        localStorage.removeItem('hireloop_user');
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(error);
  }
);
