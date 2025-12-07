/**
 * Customer Insights Repository Service
 *
 * Manages session-based storage of customer insights submitted by CSMs.
 * Provides an abstraction layer that can easily be upgraded to database storage later.
 */

/**
 * In-memory storage structure:
 * Map<sessionId, SessionData>
 *
 * SessionData: {
 *   insights: Array<Insight>,
 *   createdAt: Date,
 *   lastAccessedAt: Date
 * }
 *
 * Insight: {
 *   insightId: string,
 *   customer: { companyName, tier, arr, renewalDate, ... },
 *   request: { title, description, businessProblem, useCase, priority, deadline, category },
 *   impact: { usersAffected, revenueAtRisk, competitiveThreat, churnRisk },
 *   additional: { similarRequests, currentWorkaround, betaTesting, customBudget },
 *   meta: { completeness, requestDate },
 *   submittedAt: string,
 *   submittedBy: string
 * }
 */

// In-memory storage (Map for fast lookups)
const sessionsStore = new Map();

// Configuration
const SESSION_TTL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

/**
 * Get or create session data
 */
function getSessionData(sessionId) {
  if (!sessionsStore.has(sessionId)) {
    sessionsStore.set(sessionId, {
      insights: [],
      createdAt: new Date(),
      lastAccessedAt: new Date()
    });
  } else {
    // Update last accessed time
    const sessionData = sessionsStore.get(sessionId);
    sessionData.lastAccessedAt = new Date();
  }

  return sessionsStore.get(sessionId);
}

/**
 * Submit a new customer insight to the repository
 */
export function submitInsight(sessionId, insight) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }

  if (!insight) {
    throw new Error('Insight data is required');
  }

  const sessionData = getSessionData(sessionId);

  // Add unique ID and timestamp if not present
  const enrichedInsight = {
    ...insight,
    insightId: insight.insightId || `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    submittedAt: insight.submittedAt || new Date().toISOString(),
    submittedBy: insight.submittedBy || 'CSM'
  };

  sessionData.insights.push(enrichedInsight);

  console.log(`✓ Insight submitted to session ${sessionId}: "${enrichedInsight.request?.title || 'Untitled'}" from ${enrichedInsight.customer?.companyName || 'Unknown Company'}`);
  console.log(`  Session now has ${sessionData.insights.length} insight(s)`);

  return enrichedInsight;
}

/**
 * Get all insights for a session
 */
export function getInsights(sessionId, filters = {}) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }

  const sessionData = getSessionData(sessionId);

  let insights = sessionData.insights;

  // Apply filters if provided
  if (filters.tier) {
    insights = insights.filter(i => i.customer?.tier === filters.tier);
  }

  if (filters.priority) {
    insights = insights.filter(i => i.request?.priority === filters.priority);
  }

  if (filters.category) {
    insights = insights.filter(i => i.request?.category === filters.category);
  }

  if (filters.minCompleteness) {
    insights = insights.filter(i => i.meta?.completeness >= filters.minCompleteness);
  }

  return insights;
}

/**
 * Get insights count for a session
 */
export function getInsightsCount(sessionId) {
  if (!sessionId) {
    return 0;
  }

  const sessionData = sessionsStore.get(sessionId);
  return sessionData ? sessionData.insights.length : 0;
}

/**
 * Get aggregated statistics for insights
 */
export function getInsightsStats(sessionId) {
  const insights = getInsights(sessionId);

  const stats = {
    totalInsights: insights.length,
    totalARR: 0,
    totalRevenueAtRisk: 0,
    uniqueCustomers: new Set(),
    byTier: {},
    byPriority: {},
    byCategory: {},
    highUrgencyCount: 0
  };

  insights.forEach(insight => {
    // ARR aggregation
    if (insight.customer?.arr) {
      stats.totalARR += insight.customer.arr;
    }

    // Revenue at risk
    if (insight.impact?.revenueAtRisk) {
      stats.totalRevenueAtRisk += insight.impact.revenueAtRisk;
    }

    // Unique customers
    if (insight.customer?.companyName) {
      stats.uniqueCustomers.add(insight.customer.companyName);
    }

    // By tier
    const tier = insight.customer?.tier || 'Unknown';
    stats.byTier[tier] = (stats.byTier[tier] || 0) + 1;

    // By priority
    const priority = insight.request?.priority || 'Unknown';
    stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;

    // By category
    const category = insight.request?.category || 'Uncategorized';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

    // High urgency
    if (priority === 'high' || priority === 'critical') {
      stats.highUrgencyCount++;
    }
  });

  stats.uniqueCustomers = stats.uniqueCustomers.size;

  return stats;
}

/**
 * Clear all insights for a session (for testing/reset)
 */
export function clearSessionInsights(sessionId) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }

  // Get or create session data (ensures session exists)
  const sessionData = getSessionData(sessionId);
  const previousCount = sessionData.insights.length;
  sessionData.insights = [];

  console.log(`✓ Cleared all insights for session ${sessionId.substring(0, 8)}... (had ${previousCount} insights)`);
}

/**
 * Delete entire session (for cleanup)
 */
export function deleteSession(sessionId) {
  if (sessionsStore.has(sessionId)) {
    sessionsStore.delete(sessionId);
    console.log(`✓ Deleted session ${sessionId}`);
    return true;
  }
  return false;
}

/**
 * Clean up expired sessions
 * Should be called periodically (e.g., every hour)
 */
export function cleanupExpiredSessions() {
  const now = new Date();
  let deletedCount = 0;

  for (const [sessionId, sessionData] of sessionsStore.entries()) {
    const age = now - sessionData.lastAccessedAt;

    if (age > SESSION_TTL) {
      sessionsStore.delete(sessionId);
      deletedCount++;
    }
  }

  if (deletedCount > 0) {
    console.log(`✓ Cleaned up ${deletedCount} expired session(s)`);
  }

  return deletedCount;
}

/**
 * Get service statistics (for debugging/monitoring)
 */
export function getServiceStats() {
  return {
    totalSessions: sessionsStore.size,
    sessions: Array.from(sessionsStore.entries()).map(([sessionId, data]) => ({
      sessionId: sessionId.substring(0, 8) + '...', // Truncate for privacy
      insightsCount: data.insights.length,
      createdAt: data.createdAt,
      lastAccessedAt: data.lastAccessedAt,
      age: Date.now() - data.lastAccessedAt.getTime()
    }))
  };
}

// Set up automatic cleanup every hour
setInterval(() => {
  cleanupExpiredSessions();
}, 60 * 60 * 1000); // Run every hour

console.log('✓ Insights Service initialized');
console.log(`  Session TTL: ${SESSION_TTL / 1000 / 60} minutes`);
console.log(`  Cleanup runs every: 60 minutes`);

export default {
  submitInsight,
  getInsights,
  getInsightsCount,
  getInsightsStats,
  clearSessionInsights,
  deleteSession,
  cleanupExpiredSessions,
  getServiceStats
};
