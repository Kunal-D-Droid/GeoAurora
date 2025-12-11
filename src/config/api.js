const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isDevelopment ? 'http://127.0.0.1:8000' : 'https://geoaurora-backend.onrender.com');

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    eonet: '/api/eonet',
    donki: '/api/donki',
    neo: '/api/neo',
    summary: '/api/summary',
    detailEnrich: '/api/detail_enrich',
    keyTerms: '/api/key_terms',
    autoEnrich: '/api/auto_enrich',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default apiConfig;
