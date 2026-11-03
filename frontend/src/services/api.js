import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

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
