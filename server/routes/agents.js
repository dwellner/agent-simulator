import express from 'express';
import { sendMessage, extractTextContent, buildMessage } from '../services/claudeApi.js';
import { processIntakeMessage } from '../agents/intakeAgent.js';
import { processInsightsMessage } from '../agents/insightsAgent.js';
import { processTechSpecMessage, performAutonomousAnalysis } from '../agents/techSpecAgent.js';

const router = express.Router();

/**
 * Request validation middleware
 */
function validateAgentRequest(req, res, next) {
  const { message, conversationHistory } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Message is required and must be a non-empty string'
    });
  }

  if (conversationHistory && !Array.isArray(conversationHistory)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'conversationHistory must be an array if provided'
    });
  }

  next();
}

/**
 * Build messages array from conversation history
 */
function buildMessagesArray(conversationHistory, newMessage) {
  const messages = [];

  // Add conversation history
  if (conversationHistory && conversationHistory.length > 0) {
    for (const msg of conversationHistory) {
      if (msg.role && msg.content) {
        messages.push(buildMessage(msg.role, msg.content));
      }
    }
  }

  // Add new user message
  messages.push(buildMessage('user', newMessage));

  return messages;
}

/**
 * POST /api/agents/intake
 * Request Intake Agent (CSM) - Handles customer feature requests
 */
router.post('/intake', validateAgentRequest, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Process with intake agent
    const result = await processIntakeMessage(message, conversationHistory);

    res.json({
      success: true,
      response: result.response,
      usage: result.usage,
      contextFound: result.contextFound,
      structuredRequest: result.structuredRequest,
      requestSummary: result.requestSummary
    });

  } catch (error) {
    console.error('Intake agent error:', error);
    res.status(500).json({
      error: 'Agent Error',
      message: error.message || 'Failed to process request with intake agent'
    });
  }
});

/**
 * POST /api/agents/insights
 * Customer Insights Agent (PM) - Analyzes customer insights repository
 */
router.post('/insights', validateAgentRequest, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Ensure session exists
    if (!req.session || !req.session.id) {
      return res.status(401).json({
        error: 'Session Error',
        message: 'No session found. Please ensure cookies are enabled.'
      });
    }

    const sessionId = req.session.id;

    // Process with insights agent
    const result = await processInsightsMessage(sessionId, message, conversationHistory);

    res.json({
      success: true,
      response: result.response,
      usage: result.usage,
      insightsContext: result.insightsContext,
      techAnalysisTriggered: result.techAnalysisTriggered,
      techAnalysisResult: result.techAnalysisResult
    });

  } catch (error) {
    console.error('Insights agent error:', error);
    res.status(500).json({
      error: 'Agent Error',
      message: error.message || 'Failed to process request with insights agent'
    });
  }
});

/**
 * POST /api/agents/techspec
 * Technical Specification Agent (Engineering) - Creates technical specifications
 */
router.post('/techspec', validateAgentRequest, async (req, res) => {
  try {
    const { message, conversationHistory = [], mode = 'conversational' } = req.body;

    // Ensure session exists
    if (!req.session || !req.session.id) {
      return res.status(401).json({
        error: 'Session Error',
        message: 'No session found. Please ensure cookies are enabled.'
      });
    }

    const sessionId = req.session.id;

    // Validate mode
    if (!['conversational', 'autonomous'].includes(mode)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Mode must be either "conversational" or "autonomous"'
      });
    }

    // Process with tech spec agent
    const result = await processTechSpecMessage(sessionId, message, conversationHistory, mode);

    res.json({
      success: true,
      response: result.response,
      usage: result.usage,
      mode: result.mode,
      codebaseContext: result.codebaseContext
    });

  } catch (error) {
    console.error('Tech spec agent error:', error);
    res.status(500).json({
      error: 'Agent Error',
      message: error.message || 'Failed to process request with tech spec agent'
    });
  }
});

/**
 * POST /api/agents/techspec/autonomous
 * Trigger autonomous technical analysis (typically called by PM/Insights Agent)
 */
router.post('/techspec/autonomous', async (req, res) => {
  try {
    const { featureRequirements } = req.body;

    if (!featureRequirements) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'featureRequirements is required'
      });
    }

    // Ensure session exists
    if (!req.session || !req.session.id) {
      return res.status(401).json({
        error: 'Session Error',
        message: 'No session found. Please ensure cookies are enabled.'
      });
    }

    const sessionId = req.session.id;

    // Perform autonomous analysis
    const result = await performAutonomousAnalysis(sessionId, featureRequirements);

    // Store the tech spec in session for later retrieval by Engineering Lead
    if (!req.session.techSpecs) {
      req.session.techSpecs = [];
    }
    req.session.techSpecs.push({
      timestamp: result.timestamp,
      featureRequirements: result.featureRequirements,
      specification: result.response,
      usage: result.usage
    });

    res.json({
      success: true,
      response: result.response,
      usage: result.usage,
      codebaseContext: result.codebaseContext,
      timestamp: result.timestamp
    });

  } catch (error) {
    console.error('Autonomous tech spec error:', error);
    res.status(500).json({
      error: 'Agent Error',
      message: error.message || 'Failed to perform autonomous technical analysis'
    });
  }
});

/**
 * GET /api/agents/techspec/list
 * Get all technical specifications for the current session
 */
router.get('/techspec/list', async (req, res) => {
  try {
    // Ensure session exists
    if (!req.session || !req.session.id) {
      return res.status(401).json({
        error: 'Session Error',
        message: 'No session found. Please ensure cookies are enabled.'
      });
    }

    const techSpecs = req.session.techSpecs || [];

    res.json({
      success: true,
      count: techSpecs.length,
      techSpecs: techSpecs.map(spec => ({
        timestamp: spec.timestamp,
        featureTitle: typeof spec.featureRequirements === 'string'
          ? spec.featureRequirements.substring(0, 100)
          : spec.featureRequirements.title || 'Untitled Feature',
        hasSpecification: !!spec.specification
      }))
    });

  } catch (error) {
    console.error('List tech specs error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: error.message || 'Failed to retrieve technical specifications'
    });
  }
});

export default router;
