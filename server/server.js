import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import agentRoutes from './routes/agents.js';
import insightsRoutes from './routes/insights.js';
import { validateEnv, getEnvSummary } from './config/validateEnv.js';
import { requestLogger, errorHandler, logInfo } from './config/logger.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Validate environment variables at startup
try {
  validateEnv();
  const envSummary = getEnvSummary();
  console.log('Environment configuration:');
  console.log('  - Node environment:', envSummary.NODE_ENV);
  console.log('  - Server port:', envSummary.PORT);
  console.log('  - Claude API key:', envSummary.CLAUDE_API_KEY);
  console.log('  - Session secret:', envSummary.SESSION_SECRET);
  console.log('  - Allowed origins:', envSummary.ALLOWED_ORIGINS);
} catch (error) {
  // Exit if validation fails
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Session middleware - must be configured before routes
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
    sameSite: 'lax'
  },
  name: 'workflow.sid' // Custom session cookie name
}));

// Request logging middleware
app.use(requestLogger);

// Log session ID for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    if (req.session && req.session.id) {
      console.log(`📋 Session: ${req.session.id.substring(0, 8)}... (${req.method} ${req.path})`);
    }
    next();
  });
}

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/insights', insightsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');

  // Serve static assets
  app.use(express.static(distPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // 404 handler for API routes in development (frontend runs on Vite)
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.path}`,
      path: req.path
    });
  });
}

// Global error handling middleware
app.use(errorHandler);

// Start server
// Listen on 0.0.0.0 for containerized environments (Fly.io, Docker, etc.)
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}\n`);
});
