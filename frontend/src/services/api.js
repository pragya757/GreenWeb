import axios from 'axios';

// Determine backend API base URL:
// In production on Render, VITE_API_BASE is injected via fromService (e.g. "https://greenweb-api.onrender.com")
// Normalize rawBase to ensure it ends with /api (since all Flask backend blueprints use url_prefix="/api")
const rawBase = (import.meta.env.VITE_API_BASE || '/api').trim().replace(/\/+$/, '');
const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

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
