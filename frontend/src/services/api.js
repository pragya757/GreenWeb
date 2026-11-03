import axios from 'axios';

// ── Smart API Base URL Resolution ─────────────────────────────────────────────
// Resolves the correct backend API endpoint in all environments:
// 1. Deployed on Render (*.onrender.com) -> https://greenweb-api.onrender.com/api
// 2. Explicit full URL from env (e.g. https://custom-backend.com) -> https://custom-backend.com/api
// 3. Render service name from Blueprint (e.g. "greenweb-api") -> https://greenweb-api.onrender.com/api
// 4. Local development / dev server proxy -> /api
function getApiBase() {
  const envBase = (import.meta.env.VITE_API_BASE || '').trim().replace(/\/+$/, '');

  // 1. If an absolute http(s) URL is provided:
  if (envBase.startsWith('http://') || envBase.startsWith('https://')) {
    return envBase.endsWith('/api') ? envBase : `${envBase}/api`;
  }

  // 2. If envBase is just the Render service name like "greenweb-api":
  if (envBase && !envBase.startsWith('/')) {
    return `https://${envBase}.onrender.com/api`;
  }

  // 3. If running in the browser on Render (*.onrender.com):
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.onrender.com')) {
    return 'https://greenweb-api.onrender.com/api';
  }

  // 4. If explicit relative path was passed (e.g. "/api"):
  if (envBase.startsWith('/')) {
    return envBase.endsWith('/api') ? envBase : `${envBase}/api`;
  }

  // 5. Default local dev fallback (handled by Vite proxy)
  return '/api';
}

const API_BASE = getApiBase();

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Analysis ──────────────────────────────────────────────────────────────────
export const analyzeWebsite = (url) =>
  api.post('/analyze', { url });

// ── History ───────────────────────────────────────────────────────────────────
export const getHistory = (params = {}) =>
  api.get('/history', { params });

export const getAnalysis = (id) =>
  api.get(`/history/${id}`);

export const deleteAnalysis = (id) =>
  api.delete(`/history/${id}`);

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboard = () =>
  api.get('/dashboard');

// ── Health ────────────────────────────────────────────────────────────────────
export const getHealth = () =>
  api.get('/health');

export default api;
