import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Tickets API
export const ticketsAPI = {
  createTicket: (ticketData) => api.post('/tickets', ticketData),
  getUserTickets: (userId) => api.get(`/tickets/user/${userId}`),
  getTicketById: (ticketId) => api.get(`/tickets/${ticketId}`),
};

// Admin API
export const adminAPI = {
  getAllTickets: () => api.get('/admin/tickets'),
  getTicketById: (ticketId) => api.get(`/admin/tickets/${ticketId}`),
  updateTicketStatus: (ticketId, status) =>
    api.put(`/admin/tickets/${ticketId}/status`, { status }),
  updateTicketPriority: (ticketId, priority) =>
    api.put(`/admin/tickets/${ticketId}/priority`, { priority }),
  addTicketNote: (ticketId, note) =>
    api.post(`/admin/tickets/${ticketId}/history`, { note }),
};

export default api;

