# Session Management Architecture

## Overview

This document describes the session management implementation and key learnings from debugging session-related issues.

## Architecture

### Header-Based Session Management

We use custom HTTP headers (`X-Session-ID`) for session management instead of cookies. This approach provides better reliability across different deployment environments.

**Key Components:**

1. **Server Middleware** (`server/middleware/sessionManager.js`)
   - Custom session middleware that manages sessions via headers
   - Generates unique session IDs using `crypto.randomBytes()`
   - Stores session data in-memory Map (production should use Redis)
   - 2-hour TTL with automatic cleanup

2. **Client Utility** (`src/utils/sessionManager.js`)
   - Stores session ID in memory on the client side
   - Provides `fetchWithSession()` wrapper for all API calls
   - Automatically includes `X-Session-ID` header in requests
   - Extracts and stores session ID from response headers

3. **CORS Configuration** (`server/server.js`)
   - Allows `X-Session-ID` in request headers (`allowedHeaders`)
   - Exposes `X-Session-ID` in response headers (`exposedHeaders`)
   - Enables credentials for compatibility

### Why Headers Instead of Cookies?

**Problem with Cookies:**
- Browser treats `localhost:5173` (Vite dev server) → `localhost:3001` (API server) as cross-origin
- Cookie `SameSite` policies cause issues:
  - `SameSite: 'lax'` blocks cookies in cross-site requests
  - `SameSite: 'none'` requires `Secure: true` (HTTPS only)
- Different behavior between development (two ports) and production (same origin)
- Fragile and environment-dependent

**Solution with Headers:**
- Works identically in all environments
- No browser cookie policy concerns
- Easier to debug (visible in DevTools Network tab)
- Explicit and predictable

## Key Learnings

### 1. LLM System Prompt Clarity is Critical

**Problem:** The PM agent (Customer Insights Agent) was receiving insights data in its system prompt but responding "the insights repository you provided is currently empty."

**Root Cause:** The system prompt phrasing was too vague:
```
## Available Insights Data

You have access to a repository of customer insights...
${insightsContext}
```

Claude AI was confused about whether the insights data was:
- Actual data to analyze
- Example text or placeholder
- Instructions from the user

**Solution:** Made the prompt explicit and directive:
```
## Current Insights Repository

Below is the COMPLETE, CURRENT state of the customer insights repository...

IMPORTANT: The insights data below is REAL and CURRENT. You must reference
and analyze this specific data when answering queries.

${insightsContext}
```

**Key Insight:** When using LLMs with dynamic data in system prompts, be **extremely explicit** about what the data represents and how it should be used. Don't assume the model will infer context correctly.

### 2. Session ID Must Not Be Cleared on Every Request

**Problem:** Session ID was being cleared after every CSM message, causing each request to create a new session.

**Root Cause:** Accidental placement of `clearSessionId()` in the `finally` block of `handleCsmMessage()`:
```javascript
} finally {
  setCsmLoading(false);
  clearSessionId();  // ❌ WRONG - clears session after every message
}
```

**Solution:** Only clear session ID during explicit demo reset:
```javascript
const resetWorkflow = async () => {
  // ... reset other state ...
  clearSessionId();  // ✅ CORRECT - only clear on reset
};
```

**Key Insight:** Session management state should persist across the entire user session. Only clear it during explicit logout/reset operations, never during normal request/response cycles.

### 3. Debugging Session Issues

**Symptoms of session problems:**
- Data not persisting between requests
- "Empty repository" messages despite submissions
- Different session IDs in consecutive requests

**Debugging approach:**
1. Add logging to show session ID for each request
2. Log the session ID being sent from client
3. Log the session ID received on server
4. Verify session IDs match across the request flow
5. Check session storage to confirm data is persisting

**Useful logs we added:**
```javascript
// Server logging
console.log(`📊 Insights Agent: Session ${sessionId.substring(0, 8)}... has ${insights.length} insight(s)`);

// Client logging (in sessionManager.js)
console.log(`📝 Session ID set: ${id?.substring(0, 8)}...`);
console.log(`🧹 Session ID cleared`);
```

## Files Modified

### New Files Created
- `server/middleware/sessionManager.js` - Custom session middleware
- `src/utils/sessionManager.js` - Client-side session management
- `src/config/api.js` - Environment-aware API configuration

### Modified Files
- `server/server.js` - Replaced express-session with custom middleware, updated CORS
- `src/hooks/useWorkflowState.js` - Use `fetchWithSession()` instead of `fetch()`, add `clearSessionId()` to reset
- `server/agents/insightsAgent.js` - Made system prompt more explicit about insights data
- `vite.config.js` - Updated proxy configuration

## Best Practices

### Session Management
1. **Use headers for cross-origin scenarios** - More reliable than cookies
2. **Store minimal data in sessions** - Only IDs and metadata, not full objects
3. **Implement automatic cleanup** - Prevent memory leaks from abandoned sessions
4. **Log session activity** - Essential for debugging distributed state issues

### LLM System Prompts
1. **Be explicit about data** - State clearly what data is real vs. example
2. **Use directive language** - "You MUST analyze this data" not "You have access to data"
3. **Test prompt clarity** - If the model ignores data, the prompt may be too vague
4. **Emphasize current state** - Make it clear the data is up-to-date, not historical

### State Management
1. **Never clear state in request handlers** - Only clear during explicit user actions
2. **Keep state minimal** - Store only what's necessary
3. **Validate state consistency** - Log and verify state across request boundaries

## Production Considerations

### Current Implementation (Development)
- In-memory session storage (Map)
- 2-hour TTL
- Automatic cleanup every hour

### Production Recommendations
1. **Use Redis for session storage** - Enables horizontal scaling
2. **Configure appropriate TTL** - Balance security vs. user experience
3. **Implement session persistence** - Survive server restarts
4. **Add session metrics** - Monitor active sessions, creation rate, expiration
5. **Consider session security** - Add encryption, validate session integrity

## Testing

To verify session management is working:

1. **Check session persistence:**
   ```
   CSM submits insight → verify session ID
   PM queries insights → verify same session ID
   PM sees the insight data → confirms session worked
   ```

2. **Check session isolation:**
   ```
   Open two browser tabs
   Each should have different session IDs
   Insights submitted in one tab should not appear in the other
   ```

3. **Check session reset:**
   ```
   Submit insights
   Click "Reset Demo"
   Session ID should be cleared (check console)
   New requests should create new session
   ```

## Troubleshooting

### PM says "repository is empty" despite CSM submissions

**Check:**
1. Are session IDs matching? (Check server logs)
2. Is `clearSessionId()` being called unexpectedly? (Check console)
3. Is the system prompt emphasizing the data is REAL and CURRENT?

**Solution:** See "LLM System Prompt Clarity" section above.

### Session IDs changing between requests

**Check:**
1. Is `clearSessionId()` in a request handler? (Should only be in reset)
2. Is `fetchWithSession()` being used for all API calls?
3. Are CORS headers configured correctly?

**Solution:** Review `useWorkflowState.js` and ensure all fetch calls use `fetchWithSession()`.

### Insights not persisting

**Check:**
1. Session ID consistency (as above)
2. Insights service logs showing successful storage
3. Client-side state not being reset unexpectedly

**Solution:** Add logging to trace the full flow: submit → store → retrieve.
