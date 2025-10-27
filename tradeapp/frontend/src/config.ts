// Production API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Development API URL
const isDev = import.meta.env.DEV;
export const BASE_API_URL = isDev ? 'http://localhost:4000/api' : API_URL;

