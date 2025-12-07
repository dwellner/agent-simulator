import express from 'express';
import {
  submitInsight,
  getInsights,
  getInsightsCount,
  getInsightsStats,
  clearSessionInsights
} from '../services/insightsService.js';

const router = express.Router();

/**
 * Middleware to ensure session exists
 */
function ensureSession(req, res, next) {
  if (!req.session || !req.session.id) {
    return res.status(401).json({
      error: 'Session Error',
      message: 'No session found. Please ensure cookies are enabled.'
    });
  }
  next();
}

/**
 * POST /api/insights/submit
 * Submit a new customer insight from CSM
 */
router.post('/submit', ensureSession, (req, res) => {
  try {
    const { insight } = req.body;

    if (!insight) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Insight data is required'
      });
    }

    // Validate insight structure
    if (!insight.customer || !insight.request) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Insight must include customer and request data'
      });
    }

    const sessionId = req.session.id;
    const submittedInsight = submitInsight(sessionId, insight);

    res.json({
      success: true,
      insight: submittedInsight,
      message: 'Insight submitted successfully',
      sessionId: sessionId.substring(0, 8) + '...' // Truncated for privacy
    });

  } catch (error) {
    console.error('Error submitting insight:', error);
    res.status(500).json({
      error: 'Submission Error',
      message: error.message || 'Failed to submit insight'
    });
  }
});

/**
 * GET /api/insights
 * Retrieve all insights for the current session
 * Optional query parameters for filtering:
 * - tier: Filter by customer tier (Enterprise, Growth, Startup)
 * - priority: Filter by priority (low, medium, high, critical)
 * - category: Filter by category
 * - minCompleteness: Filter by minimum completeness percentage
 */
router.get('/', ensureSession, (req, res) => {
  try {
    const sessionId = req.session.id;
    const filters = {};

    // Extract filters from query parameters
    if (req.query.tier) filters.tier = req.query.tier;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.minCompleteness) filters.minCompleteness = parseInt(req.query.minCompleteness);

    const insights = getInsights(sessionId, filters);

    res.json({
      success: true,
      insights,
      count: insights.length,
      sessionId: sessionId.substring(0, 8) + '...'
    });

  } catch (error) {
    console.error('Error retrieving insights:', error);
    res.status(500).json({
      error: 'Retrieval Error',
      message: error.message || 'Failed to retrieve insights'
    });
  }
});

/**
 * GET /api/insights/count
 * Get count of insights for the current session
 */
router.get('/count', ensureSession, (req, res) => {
  try {
    const sessionId = req.session.id;
    const count = getInsightsCount(sessionId);

    res.json({
      success: true,
      count,
      sessionId: sessionId.substring(0, 8) + '...'
    });

  } catch (error) {
    console.error('Error getting insights count:', error);
    res.status(500).json({
      error: 'Count Error',
      message: error.message || 'Failed to get insights count'
    });
  }
});

/**
 * GET /api/insights/stats
 * Get aggregated statistics for insights in the current session
 */
router.get('/stats', ensureSession, (req, res) => {
  try {
    const sessionId = req.session.id;
    const stats = getInsightsStats(sessionId);

    res.json({
      success: true,
      stats,
      sessionId: sessionId.substring(0, 8) + '...'
    });

  } catch (error) {
    console.error('Error getting insights stats:', error);
    res.status(500).json({
      error: 'Stats Error',
      message: error.message || 'Failed to get insights statistics'
    });
  }
});

/**
 * DELETE /api/insights/clear
 * Clear all insights for the current session (for testing/reset)
 */
router.delete('/clear', ensureSession, (req, res) => {
  try {
    const sessionId = req.session.id;
    clearSessionInsights(sessionId);

    res.json({
      success: true,
      message: 'All insights cleared for this session',
      sessionId: sessionId.substring(0, 8) + '...'
    });

  } catch (error) {
    console.error('Error clearing insights:', error);
    res.status(500).json({
      error: 'Clear Error',
      message: error.message || 'Failed to clear insights'
    });
  }
});

/**
 * POST /api/insights/reset
 * Reset all session data (insights + tech specs) for demo reset
 */
router.post('/reset', ensureSession, (req, res) => {
  try {
    const sessionId = req.session.id;

    // Clear insights from insights service
    clearSessionInsights(sessionId);

    // Clear tech specs from session
    if (req.session.techSpecs) {
      req.session.techSpecs = [];
    }

    console.log(`✓ Reset all data for session ${sessionId.substring(0, 8)}...`);

    res.json({
      success: true,
      message: 'All session data has been reset',
      sessionId: sessionId.substring(0, 8) + '...'
    });

  } catch (error) {
    console.error('Error resetting session:', error);
    res.status(500).json({
      error: 'Reset Error',
      message: error.message || 'Failed to reset session data'
    });
  }
});

export default router;
