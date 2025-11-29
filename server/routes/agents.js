import express from 'express';
import { sendMessage, extractTextContent, buildMessage } from '../services/claudeApi.js';
import { processIntakeMessage } from '../agents/intakeAgent.js';

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
      contextFound: result.contextFound
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
 * POST /api/agents/queue
 * Product Queue Agent (PM) - Manages and analyzes feature request queue
 */
router.post('/queue', validateAgentRequest, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Build messages array
    const messages = buildMessagesArray(conversationHistory, message);

    // System prompt for Product Queue Agent
    const systemPrompt = `You are a Product Queue Agent for a Product Manager.

Your role:
- Help PMs analyze and synthesize across feature request queues
- Identify patterns and themes across requests
- Provide insights on urgency, customer impact, and ARR implications
- Query and aggregate data from the queue
- Coordinate with the Technical Specification Agent when needed

Capabilities:
- Pattern matching across requests
- Aggregating ARR and customer counts
- Grouping by urgency, category, or customer tier
- Identifying themes in feature requests

Keep responses analytical and data-driven.`;

    // Send to Claude API
    const response = await sendMessage({
      messages,
      system: systemPrompt,
      maxTokens: 1024
    });

    const agentResponse = extractTextContent(response);

    res.json({
      success: true,
      response: agentResponse,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    });

  } catch (error) {
    console.error('Queue agent error:', error);
    res.status(500).json({
      error: 'Agent Error',
      message: error.message || 'Failed to process request with queue agent'
    });
  }
});

/**
 * POST /api/agents/techspec
 * Technical Specification Agent (Engineering) - Creates technical specifications
 */
router.post('/techspec', validateAgentRequest, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Build messages array
    const messages = buildMessagesArray(conversationHistory, message);

    // System prompt for Technical Specification Agent
    const systemPrompt = `You are a Technical Specification Agent for an Engineering Lead.

Your role:
- Analyze feature requirements and create technical specifications
- Review codebase architecture and past implementations
- Provide multiple implementation approaches with trade-offs
- Estimate complexity and identify risks/dependencies
- Help refine technical decisions through conversation

Capabilities:
- Autonomous technical analysis when triggered by PM
- Conversational refinement with Engineering Lead
- Architecture pattern recommendations
- Complexity estimation
- Risk and dependency identification

Keep responses technical but accessible, focusing on practical implementation details.`;

    // Send to Claude API
    const response = await sendMessage({
      messages,
      system: systemPrompt,
      maxTokens: 1024
    });

    const agentResponse = extractTextContent(response);

    res.json({
      success: true,
      response: agentResponse,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    });

  } catch (error) {
    console.error('Tech spec agent error:', error);
    res.status(500).json({
      error: 'Agent Error',
      message: error.message || 'Failed to process request with tech spec agent'
    });
  }
});

export default router;
