/**
 * API base URL for any device:
 * - Dev: Vite proxies `/api` → Flask on port 5000
 * - Production (single host): same origin `/api`
 * - Split deploy: set VITE_API_BASE_URL=https://your-api.example.com/api at build time
 */
export const getApiBaseUrl = () => {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).replace(/\/$/, '');
  }
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
