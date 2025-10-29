// Detect if we're in production
const isDev = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Auto-detect API URL based on environment
const getApiUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, use same origin (relative URL)
  if (isProduction) {
    return '/api'; // Relative URL - will use same domain
  }
  
  // In development, use localhost
  return 'http://localhost:4000/api';
};

export const BASE_API_URL = getApiUrl();

