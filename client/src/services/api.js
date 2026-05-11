import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach JWT token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('campusops_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — redirect to login
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('campusops_token');
      localStorage.removeItem('campusops_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (creds)   => API.post('/auth/login', creds),
  getMe: ()        => API.get('/auth/me'),
};

export const metricsAPI = {
  getAll:          () => API.get('/metrics'),
};

export const energyAPI = {
  getAll:          () => API.get('/energy'),
};

export const hvacAPI = {
  getAll:          () => API.get('/hvac'),
  getZone: (id)    => API.get(`/hvac/${id}`),
  setZone: (id, d) => API.patch(`/hvac/${id}`, d),
};

export const networkAPI = {
  getAll:          () => API.get('/network'),
};

export const securityAPI = {
  getAll:          () => API.get('/security'),
};

export const alertsAPI = {
  getAll: (params) => API.get('/alerts', { params }),
  resolve: (id)    => API.post(`/alerts/${id}/resolve`),
};

export const servicesAPI = {
  getAll:          () => API.get('/services'),
  getHealth:       () => API.get('/services/health'),
};

export const pipelineAPI = {
  getStatus:       () => API.get('/pipeline/status'),
  getRuns:         () => API.get('/pipeline/runs'),
};

export default API;
