import axios from 'axios';
import { BASE_API_URL } from '../config';

const API_URL = BASE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.data.token);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const listingsApi = {
  getListings: async () => {
    const response = await api.get('/listings');
    return response.data;
  },
  
  getMyListings: async () => {
    const response = await api.get('/listings/my-listings');
    return response.data;
  },
  
  getAvailableListings: async () => {
    const response = await api.get('/listings/available');
    return response.data;
  },
  
  createListing: async (listing: any) => {
    const response = await api.post('/listings', listing);
    return response.data;
  },
  
  updateListing: async (id: string, listing: any) => {
    const response = await api.put(`/listings/${id}`, listing);
    return response.data;
  },
  
  deleteListing: async (id: string) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },

  likeItem: async (id: string) => {
    const response = await api.post(`/listings/${id}/like`);
    return response.data;
  },
};

export default api;

