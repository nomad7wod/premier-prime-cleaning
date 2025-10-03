// API Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8080/api',
  },
  production: {
    // This will be automatically set based on the current domain
    API_BASE_URL: process.env.REACT_APP_API_URL || `${window.location.origin}/api`,
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_CONFIG = config[environment];

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};

export default API_CONFIG;