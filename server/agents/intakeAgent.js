import { sendMessage, extractTextContent, buildMessage } from '../services/claudeApi.js';
import { mockCustomers, getCustomerByName } from '../../src/data/mockCustomers.js';
import { mockRequests, getRequestsByCategory } from '../../src/data/mockRequests.js';

/**
 * Request Intake Agent
 * Helps CSMs gather complete information about customer feature requests
 */

/**
 * Build the system prompt for the Request Intake Agent
 */
function buildSystemPrompt() {
  return `You are a Request Intake Agent assisting a Customer Success Manager (CSM).

## Your Role
You help CSMs gather complete, structured information about customer feature requests. You are:
- **Proactive**: Ask clarifying questions to fill in gaps
- **Thorough**: Ensure all critical details are captured
- **Context-aware**: Reference customer data and historical requests
- **Concise**: Keep responses focused and actionable
- **Professional**: Maintain a friendly, helpful tone

## Information to Extract

You must gather the following information about each feature request:

### Required Information:
1. **Customer Details**
   - Company name
   - Customer tier (Enterprise, Growth, Startup)
   - Current ARR
   - Contract renewal date

2. **Request Details**
   - Feature description (what they want)
   - Business problem (why they need it)
   - Use case (how they'll use it)
   - Priority/urgency
   - Deadline or timeline constraints

3. **Impact Assessment**
   - Number of users affected
   - Revenue at risk (if not addressed)
   - Competitive threat (if any)
   - Churn risk

### Optional but Valuable:
- Similar requests from other customers
- Workarounds they're currently using
- Willingness to participate in beta testing
- Budget/willingness to pay for custom development

## Available Context

You have access to the following data sources:

### Customer Database
${mockCustomers.length} customers in database with details about:
- Company name, tier, ARR, renewal dates
- Contact information
- Account health metrics

Sample customers: ${mockCustomers.slice(0, 3).map(c => c.companyName).join(', ')}

### Historical Feature Requests
${mockRequests.length} historical requests across categories:
- Integrations (${getRequestsByCategory('Integrations').length} requests)
- Reporting (${getRequestsByCategory('Reporting').length} requests)
- Mobile (${getRequestsByCategory('Mobile').length} requests)
- API (${getRequestsByCategory('API').length} requests)

## Conversation Strategy

1. **Start by identifying the customer**: If not provided, ask for company name
2. **Acknowledge context**: If you can identify the customer from the database, mention their tier/ARR
3. **Ask targeted questions**: Based on what's missing, ask specific questions
4. **Search for patterns**: Look for similar historical requests to provide context
5. **Summarize when complete**: Once all required info is gathered, provide a brief summary

## Important Guidelines

- **Use provided context**: If you see "[Context from database: ...]" in a message, USE that information in your response
- **Acknowledge customer data**: If customer details are provided, reference their tier, ARR, or account health
- **Reference similar requests**: If historical requests are provided, mention them to show pattern awareness
- **Don't make up data**: If customer info isn't provided in context, ask for it
- **Be specific**: Ask for quantifiable details (e.g., "How many users need this?" not "Do users need this?")
- **One question at a time**: Don't overwhelm with too many questions at once
- **Acknowledge urgency**: If they mention deadlines or competitive threats, treat it seriously
- **Flag incomplete info**: If important details are missing, call them out

## Example Interactions

**Good approach:**
User: "Acme Corp wants Excel export"
Agent: "Got it! Acme Corp is one of our Enterprise customers ($150K ARR). Can you tell me more about what data they want to export? Is this for a specific report or their entire dataset?"

**Bad approach:**
User: "A customer wants Excel export"
Agent: "Okay, I've noted that request."

Remember: Your goal is to help the CSM capture a complete, actionable feature request that the Product team can evaluate and prioritize effectively.`;
}

/**
 * Extract customer context from the message
 * Looks for customer names mentioned in the conversation
 */
function extractCustomerContext(message, conversationHistory) {
  const allMessages = [
    ...conversationHistory.map(m => m.content),
    message
  ].join(' ');

  // Try to find a customer by name
  for (const customer of mockCustomers) {
    const companyName = customer.companyName.toLowerCase();
    if (allMessages.toLowerCase().includes(companyName.split(' ')[0])) {
      return customer;
    }
  }
  return null;
}

/**
 * Search for similar historical requests
 * Looks for keywords in the message to find related past requests
 */
function searchSimilarRequests(message) {
  const keywords = message.toLowerCase();
  const similar = [];

  // Simple keyword matching
  if (keywords.includes('export') || keywords.includes('excel') || keywords.includes('csv')) {
    similar.push(...mockRequests.filter(r =>
      r.description.toLowerCase().includes('export') ||
      r.description.toLowerCase().includes('excel')
    ));
  }
  if (keywords.includes('integration') || keywords.includes('integrate')) {
    similar.push(...mockRequests.filter(r => r.category === 'Integrations'));
  }
  if (keywords.includes('report') || keywords.includes('dashboard')) {
    similar.push(...mockRequests.filter(r => r.category === 'Reporting'));
  }
  if (keywords.includes('mobile') || keywords.includes('app')) {
    similar.push(...mockRequests.filter(r => r.category === 'Mobile'));
  }
  if (keywords.includes('api')) {
    similar.push(...mockRequests.filter(r => r.category === 'API'));
  }

  // Remove duplicates
  const uniqueRequests = Array.from(new Set(similar.map(r => r.id)))
    .map(id => similar.find(r => r.id === id));

  return uniqueRequests.slice(0, 3); // Return top 3
}

/**
 * Build enhanced context message with customer and historical data
 */
function buildContextMessage(customerData, similarRequests) {
  let context = '';

  if (customerData) {
    context += `\n**Customer Context Found:**\n`;
    context += `- Company: ${customerData.companyName}\n`;
    context += `- Tier: ${customerData.tier}\n`;
    context += `- ARR: $${customerData.arr.toLocaleString()}\n`;
    context += `- Renewal Date: ${customerData.contractRenewalDate}\n`;
    context += `- Account Health: ${customerData.accountHealth}\n`;
    context += `- Contact: ${customerData.contactPerson} (${customerData.contactEmail})\n`;
  }

  if (similarRequests && similarRequests.length > 0) {
    context += `\n**Similar Historical Requests Found:**\n`;
    similarRequests.forEach((req, index) => {
      context += `${index + 1}. ${req.description} (${req.category}, Priority: ${req.priority})\n`;
      context += `   - Customer: ${req.customer}\n`;
      context += `   - Status: ${req.status}\n`;
      if (req.revenueAtRisk > 0) {
        context += `   - Revenue at Risk: $${req.revenueAtRisk.toLocaleString()}\n`;
      }
    });
  }

  return context;
}

/**
 * Process a message with the Request Intake Agent
 *
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<Object>} Agent response with metadata
 */
export async function processIntakeMessage(message, conversationHistory = []) {
  // Extract context from the conversation
  const customerData = extractCustomerContext(message, conversationHistory);
  const similarRequests = searchSimilarRequests(message);

  // Build context message
  const contextInfo = buildContextMessage(customerData, similarRequests);

  // Build messages array
  const messages = [];

  // Add conversation history
  if (conversationHistory && conversationHistory.length > 0) {
    for (const msg of conversationHistory) {
      if (msg.role && msg.content) {
        messages.push(buildMessage(msg.role, msg.content));
      }
    }
  }

  // Add context as a system-level user message if we found any
  if (contextInfo.trim()) {
    const enhancedMessage = `${message}\n\n[Context from database:${contextInfo}]`;
    messages.push(buildMessage('user', enhancedMessage));
  } else {
    messages.push(buildMessage('user', message));
  }

  // Get system prompt
  const systemPrompt = buildSystemPrompt();

  // Send to Claude API
  const response = await sendMessage({
    messages,
    system: systemPrompt,
    maxTokens: 1024
  });

  const agentResponse = extractTextContent(response);

  return {
    response: agentResponse,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens
    },
    contextFound: {
      customer: !!customerData,
      similarRequests: similarRequests.length
    }
  };
}

export default {
  processIntakeMessage,
  buildSystemPrompt
};
