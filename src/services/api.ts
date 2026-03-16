import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials: any) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
};

export const profileService = {
  get: () => api.get('/cv-data'),
  update: (data: any) => api.put('/profile', data),
};

export const skillService = {
  getAll: () => api.get('/skills'),
  create: (data: any) => api.post('/skills', data),
  update: (id: number, data: any) => api.put(`/skills/${id}`, data),
  delete: (id: number) => api.delete(`/skills/${id}`),
};

export const projectService = {
  getAll: () => api.get('/projects'),
  create: (data: any) => api.post('/projects', data),
  update: (id: number, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

export const experienceService = {
  getAll: () => api.get('/experience'),
  create: (data: any) => api.post('/experience', data),
  update: (id: number, data: any) => api.put(`/experience/${id}`, data),
  delete: (id: number) => api.delete(`/experience/${id}`),
};

export const messageService = {
  getAll: () => api.get('/messages'),
  delete: (id: number) => api.delete(`/messages/${id}`),
};

export const mediaService = {
  getAll: () => api.get('/media'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id: number) => api.delete(`/media/${id}`),
};

export default api;
