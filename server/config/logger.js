/**
 * Logging Configuration
 * Provides structured logging with configurable log levels
 */

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info;
const enableErrorStack = process.env.ENABLE_ERROR_STACK !== 'false';

/**
 * Format timestamp for logs
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Log an error message
 */
export function logError(message, error = null) {
  if (currentLogLevel >= LOG_LEVELS.error) {
    console.error(`[${getTimestamp()}] ERROR:`, message);
    if (error && enableErrorStack && error.stack) {
      console.error(error.stack);
    } else if (error) {
      console.error(error);
    }
  }
}

/**
 * Log a warning message
 */
export function logWarn(message, context = null) {
  if (currentLogLevel >= LOG_LEVELS.warn) {
    console.warn(`[${getTimestamp()}] WARN:`, message);
    if (context) {
      console.warn('Context:', context);
    }
  }
}

/**
 * Log an info message
 */
export function logInfo(message, context = null) {
  if (currentLogLevel >= LOG_LEVELS.info) {
    console.log(`[${getTimestamp()}] INFO:`, message);
    if (context) {
      console.log('Context:', context);
    }
  }
}

/**
 * Log a debug message
 */
export function logDebug(message, context = null) {
  if (currentLogLevel >= LOG_LEVELS.debug) {
    console.log(`[${getTimestamp()}] DEBUG:`, message);
    if (context) {
      console.log('Context:', context);
    }
  }
}

/**
 * Log an API request
 */
export function logRequest(req) {
  if (currentLogLevel >= LOG_LEVELS.info) {
    const { method, url, ip } = req;
    console.log(`[${getTimestamp()}] ${method} ${url} - IP: ${ip}`);
  }
}

/**
 * Log an API error response
 */
export function logApiError(req, error, statusCode = 500) {
  logError(`API Error: ${req.method} ${req.url} - Status: ${statusCode}`, error);
}

/**
 * Express middleware for request logging
 */
export function requestLogger(req, res, next) {
  const start = Date.now();

  // Log request
  logRequest(req);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    if (statusCode >= 500) {
      logError(`${req.method} ${req.url} - ${statusCode} (${duration}ms)`);
    } else if (statusCode >= 400) {
      logWarn(`${req.method} ${req.url} - ${statusCode} (${duration}ms)`);
    } else {
      logDebug(`${req.method} ${req.url} - ${statusCode} (${duration}ms)`);
    }
  });

  next();
}

/**
 * Express error handler middleware
 * Should be added after all other middleware
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log the error
  logApiError(req, err, statusCode);

  // Send error response
  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    // Include stack trace only in development
    ...((!isProduction && enableErrorStack) && { stack: err.stack })
  });
}
