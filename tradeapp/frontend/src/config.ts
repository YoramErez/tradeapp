// Get API URL - this function is called at runtime
// IMPORTANT: Vite replaces import.meta.env.PROD at build time
// In production builds (npm run build), this will always be /api
const getApiUrl = () => {
  // If VITE_API_URL is explicitly set via environment variable, use it (highest priority)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // CRITICAL: In production builds, Vite sets import.meta.env.PROD = true at build time
  // This branch will be taken in ALL production bundles, regardless of runtime environment
  if (import.meta.env.PROD) {
    return '/api'; // Production build: always use relative URL
  }
  
  // Development mode (npm run dev)
  // Check if running on a remote server (not localhost)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('192.168.')) {
      return '/api'; // Remote development: use relative URL
    }
  }
  
  // Default: local development on localhost
  return 'http://localhost:4000/api';
};

// Export function for runtime evaluation
export const getBaseApiUrl = getApiUrl;

// Export constant - but this will be /api in production builds
export const BASE_API_URL = getApiUrl();

