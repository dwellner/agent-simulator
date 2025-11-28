import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Validate environment before starting
validateEnvironment();

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}\n`);
});
