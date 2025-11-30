import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import agentRoutes from './routes/agents.js';
import insightsRoutes from './routes/insights.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
function validateEnvironment() {
  const requiredEnvVars = ['CLAUDE_API_KEY'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingEnvVars.length > 0) {
    console.warn('⚠️  Warning: Missing required environment variables:', missingEnvVars.join(', '));
    console.warn('⚠️  Please add them to your .env file');
    console.warn('⚠️  Server will start but API functionality may be limited');
  } else {
    console.log('✓ All required environment variables are set');
  }

  // Log configuration (non-sensitive)
  console.log('✓ Server port:', process.env.PORT || 3001);
  console.log('✓ Node environment:', process.env.NODE_ENV || 'development');
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

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    path: req.path
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Default to 500 if no status code is set
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: err.name || 'Error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Validate environment before starting
validateEnvironment();

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}\n`);
});
