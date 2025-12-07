/**
 * Environment Variable Validation
 * Validates required environment variables at server startup
 */

const REQUIRED_ENV_VARS = [
  {
    name: 'CLAUDE_API_KEY',
    validate: (value) => value && value.startsWith('sk-ant-'),
    errorMessage: 'CLAUDE_API_KEY must be set and start with "sk-ant-"'
  }
];

const PROD_REQUIRED_ENV_VARS = [
  {
    name: 'SESSION_SECRET',
    validate: (value) => value && value !== 'dev-secret-change-in-production' && value.length >= 32,
    errorMessage: 'SESSION_SECRET must be set in production and be at least 32 characters long'
  }
];

/**
 * Validates all required environment variables
 * @throws {Error} If validation fails
 */
export function validateEnv() {
  const errors = [];
  const isProduction = process.env.NODE_ENV === 'production';

  // Validate required variables for all environments
  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar.name];
    if (!value || !envVar.validate(value)) {
      errors.push(`❌ ${envVar.errorMessage}`);
    }
  }

  // Validate production-specific variables
  if (isProduction) {
    for (const envVar of PROD_REQUIRED_ENV_VARS) {
      const value = process.env[envVar.name];
      if (!value || !envVar.validate(value)) {
        errors.push(`❌ ${envVar.errorMessage}`);
      }
    }

    // Warn about development defaults in production
    if (process.env.ALLOWED_ORIGINS === 'http://localhost:5173') {
      console.warn('⚠️  Warning: ALLOWED_ORIGINS is set to localhost. Update for production.');
    }
  }

  // Log validation status
  if (errors.length > 0) {
    console.error('\n' + '='.repeat(60));
    console.error('ENVIRONMENT VALIDATION FAILED');
    console.error('='.repeat(60));
    errors.forEach(error => console.error(error));
    console.error('='.repeat(60));
    console.error('\nPlease check your .env file and ensure all required');
    console.error('environment variables are properly configured.');
    console.error('\nSee .env.example for reference.\n');
    throw new Error('Environment validation failed');
  }

  // Success message
  console.log('✓ Environment variables validated successfully');
}

/**
 * Gets the current environment configuration (safe for logging)
 * Masks sensitive values
 */
export function getEnvSummary() {
  const maskValue = (value) => {
    if (!value) return '<not set>';
    if (value.length <= 10) return '***';
    return value.substring(0, 7) + '...' + value.substring(value.length - 3);
  };

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3001,
    CLAUDE_API_KEY: maskValue(process.env.CLAUDE_API_KEY),
    SESSION_SECRET: process.env.SESSION_SECRET ? '***' : '<using default>',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:5173',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
  };
}
