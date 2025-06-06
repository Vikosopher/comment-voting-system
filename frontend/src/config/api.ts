/// <reference types="vite/client" />
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh'
    },
    COMMENTS: {
      LIST: '/comments',
      TOP: '/comments/top',
      CREATE: '/comments',
      VOTE: '/comments/:id/vote',
      SEED: '/comments/seed'
    }
  }
};

export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}; 