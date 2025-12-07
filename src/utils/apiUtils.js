/**
 * API Utility Functions
 * Provides retry logic, error handling, and helper functions for API calls
 */

/**
 * Sleep utility for retry delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 *
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries (default: 2)
 * @param {number} options.initialDelay - Initial delay in ms (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 5000)
 * @param {Function} options.shouldRetry - Function to determine if error is retryable
 * @returns {Promise} Result of the function call
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 2,
    initialDelay = 1000,
    maxDelay = 5000,
    shouldRetry = (error) => true
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if we've exhausted attempts or if error is not retryable
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Determine if an error should be retried
 * Returns false for client errors (4xx), true for server errors (5xx) and network errors
 */
export function isRetryableError(error) {
  // Network errors (fetch failed, timeout, etc.)
  if (error.message && error.message.includes('fetch')) {
    return true;
  }

  // Server errors (500, 502, 503, 504)
  if (error.message && /Server error: (500|502|503|504)/.test(error.message)) {
    return true;
  }

  // Don't retry client errors (400, 401, 403, 404, etc.)
  if (error.message && /Server error: (4\d{2})/.test(error.message)) {
    return false;
  }

  // Default: don't retry unknown errors
  return false;
}

/**
 * Get user-friendly error message based on error type
 */
export function getUserFriendlyErrorMessage(error, agentName = 'the agent') {
  const errorMsg = error.message || '';

  // Network/connection errors
  if (errorMsg.includes('fetch') || errorMsg.includes('NetworkError')) {
    return `Cannot connect to server. Please check your internet connection and ensure the backend is running.`;
  }

  // Timeout errors
  if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
    return `Request timed out. The server is taking too long to respond. Please try again.`;
  }

  // HTTP status code errors
  if (errorMsg.includes('Server error: 401')) {
    return `Authentication error. Your session may have expired. Please refresh the page.`;
  }

  if (errorMsg.includes('Server error: 403')) {
    return `Access denied. You don't have permission to perform this action.`;
  }

  if (errorMsg.includes('Server error: 404')) {
    return `Service not found. The requested endpoint doesn't exist.`;
  }

  if (errorMsg.includes('Server error: 429')) {
    return `Too many requests. Please wait a moment before trying again.`;
  }

  if (errorMsg.includes('Server error: 500')) {
    return `Internal server error. Something went wrong on the server. This has been logged.`;
  }

  if (errorMsg.includes('Server error: 502')) {
    return `Bad gateway. The server is temporarily unavailable. Please try again in a moment.`;
  }

  if (errorMsg.includes('Server error: 503')) {
    return `Service unavailable. The server is temporarily down for maintenance. Please try again later.`;
  }

  if (errorMsg.includes('Server error: 504')) {
    return `Gateway timeout. The server took too long to respond. Please try again.`;
  }

  // Generic server error
  if (/Server error: \d+/.test(errorMsg)) {
    return `Server error occurred. ${errorMsg}`;
  }

  // API-specific errors (validation, etc.)
  if (errorMsg.includes('Validation Error')) {
    return `Invalid request: ${errorMsg}`;
  }

  // Unknown/generic error
  return `Failed to communicate with ${agentName}. ${errorMsg}`;
}

export default {
  retryWithBackoff,
  isRetryableError,
  getUserFriendlyErrorMessage
};
