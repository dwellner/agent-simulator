/**
 * Client-side session management
 * Stores session ID in memory and sends it with every request
 */

let sessionId = null;

/**
 * Get current session ID
 */
export function getSessionId() {
  return sessionId;
}

/**
 * Set session ID (received from server)
 */
export function setSessionId(id) {
  sessionId = id;
  console.log(`📝 Session ID set: ${id?.substring(0, 8)}...`);
}

/**
 * Clear session ID (for reset)
 */
export function clearSessionId() {
  sessionId = null;
  console.log('🧹 Session ID cleared');
}

/**
 * Make a fetch request with session ID header
 */
export async function fetchWithSession(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Add session ID if we have one
  if (sessionId) {
    headers['X-Session-ID'] = sessionId;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // Still include for compatibility
  });

  // Store session ID from response header
  const newSessionId = response.headers.get('X-Session-ID');
  if (newSessionId && newSessionId !== sessionId) {
    setSessionId(newSessionId);
  }

  return response;
}
