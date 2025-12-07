/**
 * Simple session management using custom headers
 * More reliable than cookies for development/production consistency
 */

import crypto from 'crypto';

// In-memory session storage (in production, use Redis or similar)
const sessions = new Map();

// Session TTL: 2 hours
const SESSION_TTL = 2 * 60 * 60 * 1000;

/**
 * Generate a new session ID
 */
function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Clean up expired sessions periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastAccess > SESSION_TTL) {
      sessions.delete(sessionId);
      console.log(`🧹 Cleaned up expired session: ${sessionId.substring(0, 8)}...`);
    }
  }
}, 60 * 60 * 1000); // Run every hour

/**
 * Middleware to manage sessions via custom header
 */
export function sessionMiddleware(req, res, next) {
  // Get session ID from header or generate new one
  let sessionId = req.headers['x-session-id'];

  if (!sessionId || !sessions.has(sessionId)) {
    // Create new session
    sessionId = generateSessionId();
    sessions.set(sessionId, {
      id: sessionId,
      data: {},
      createdAt: Date.now(),
      lastAccess: Date.now()
    });
    console.log(`📝 Created new session: ${sessionId.substring(0, 8)}...`);
  } else {
    // Update last access time
    const session = sessions.get(sessionId);
    session.lastAccess = Date.now();
  }

  // Attach session to request
  req.session = sessions.get(sessionId);

  // Send session ID back to client
  res.setHeader('X-Session-ID', sessionId);

  next();
}

/**
 * Get session data
 */
export function getSession(sessionId) {
  return sessions.get(sessionId);
}

/**
 * Clear all data for a session
 */
export function clearSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session) {
    session.data = {};
    session.lastAccess = Date.now();
  }
}

/**
 * Delete a session entirely
 */
export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}
