// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://geoaurora-backend-432163986190.asia-south1.run.app';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    eonet: '/api/eonet',
    donki: '/api/donki',
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
