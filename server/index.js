/**
 * KisanQueue API Server
 *
 * Minimal Express server that provides secure backend API routes.
 * The OpenAI API key lives ONLY here — it is NEVER sent to the browser.
 *
 * Start: node server/index.js  (or: cd server && npm run dev)
 * Default port: 3001
 * Vite dev server proxies /api/* to this server automatically.
 */

import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import farmerAssistantRouter from './routes/farmerAssistant.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// ─────────────────────────────────────────────────────────────────────────────
// CORS — only allow the Vite dev frontend origin in development
// In production, configure this to match your deployed frontend domain.
// ─────────────────────────────────────────────────────────────────────────────

const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, same-origin in prod)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: Origin ${origin} not allowed.`));
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// ─────────────────────────────────────────────────────────────────────────────
// Body parsing — limit size to prevent abuse
// ─────────────────────────────────────────────────────────────────────────────

app.use(express.json({ limit: '16kb' }));

// ─────────────────────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────────────────────

app.get(['/api/health', '/health'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'KisanQueue API',
    timestamp: new Date().toISOString(),
    aiConfigured: !!process.env.OPENAI_API_KEY,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────────────────────

app.use('/api/farmer-assistant', farmerAssistantRouter);
app.use('/farmer-assistant', farmerAssistantRouter);

// ─────────────────────────────────────────────────────────────────────────────
// 404 fallback for unknown API routes
// ─────────────────────────────────────────────────────────────────────────────

app.use(['/api/*', '/farmer-assistant/*'], (_req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

// ─────────────────────────────────────────────────────────────────────────────
// Global error handler
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[SERVER] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─────────────────────────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✓ KisanQueue API server running on http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠  OPENAI_API_KEY is not set. AI features will fail. Copy server/.env.example to server/.env and set your key.');
  } else {
    console.log('✓ OPENAI_API_KEY loaded.');
  }
});
