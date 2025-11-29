import Anthropic from '@anthropic-ai/sdk';

/**
 * Claude API Service
 * Handles all interactions with the Anthropic Claude API
 */

// Lazy-initialized Anthropic client
let anthropic = null;

/**
 * Get or initialize the Anthropic client
 */
function getClient() {
  if (!anthropic) {
    if (!process.env.CLAUDE_API_KEY) {
      throw new Error('CLAUDE_API_KEY environment variable is not set');
    }
    anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }
  return anthropic;
}

// Default model to use (using Claude 3 Haiku for maximum compatibility)
const DEFAULT_MODEL = 'claude-3-haiku-20240307';

// Maximum retries for failed requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Send a message to Claude and get a response
 *
 * @param {Object} options - Message options
 * @param {Array} options.messages - Array of message objects with role and content
 * @param {string} options.system - System prompt (optional)
 * @param {string} options.model - Model to use (optional, defaults to DEFAULT_MODEL)
 * @param {number} options.maxTokens - Maximum tokens in response (optional, defaults to 1024)
 * @returns {Promise<Object>} Claude API response
 */
export async function sendMessage({
  messages,
  system = null,
  model = DEFAULT_MODEL,
  maxTokens = 1024
}) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages array is required and must not be empty');
  }

  const params = {
    model,
    max_tokens: maxTokens,
    messages
  };

  if (system) {
    params.system = system;
  }

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const client = getClient();
      const response = await client.messages.create(params);
      return response;
    } catch (error) {
      lastError = error;
      console.error(`Claude API error (attempt ${attempt}/${MAX_RETRIES}):`, error.message);

      // Don't retry on client errors (4xx)
      if (error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Retry on server errors (5xx) or network errors
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * attempt; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // All retries failed
  throw lastError;
}

/**
 * Send a message to Claude and stream the response
 *
 * @param {Object} options - Message options (same as sendMessage)
 * @returns {AsyncGenerator} Async generator that yields text chunks
 */
export async function* streamMessage({
  messages,
  system = null,
  model = DEFAULT_MODEL,
  maxTokens = 1024
}) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages array is required and must not be empty');
  }

  const params = {
    model,
    max_tokens: maxTokens,
    messages,
    stream: true
  };

  if (system) {
    params.system = system;
  }

  try {
    const client = getClient();
    const stream = await client.messages.create(params);

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  } catch (error) {
    console.error('Claude API streaming error:', error);
    throw error;
  }
}

/**
 * Extract text content from Claude API response
 *
 * @param {Object} response - Claude API response object
 * @returns {string} Extracted text content
 */
export function extractTextContent(response) {
  if (!response || !response.content || !Array.isArray(response.content)) {
    return '';
  }

  return response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('');
}

/**
 * Build a message object for Claude API
 *
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Message content
 * @returns {Object} Message object
 */
export function buildMessage(role, content) {
  if (!['user', 'assistant'].includes(role)) {
    throw new Error('Role must be "user" or "assistant"');
  }
  if (!content || typeof content !== 'string') {
    throw new Error('Content must be a non-empty string');
  }
  return { role, content };
}

export default {
  sendMessage,
  streamMessage,
  extractTextContent,
  buildMessage
};
