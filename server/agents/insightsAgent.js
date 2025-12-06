import { sendMessage, buildMessage, extractTextContent } from '../services/claudeApi.js';
import { getInsights, getInsightsStats } from '../services/insightsService.js';
import { performAutonomousAnalysis } from './techSpecAgent.js';

/**
 * Customer Insights Agent
 * Helps Product Managers explore and analyze customer insights through conversation
 */

/**
 * Build the system prompt for the Customer Insights Agent
 */
function buildSystemPrompt(insightsContext) {
  return `You are a Customer Insights Agent assisting a Product Manager (PM).

## Your Role

You help PMs explore and analyze customer insights through natural conversation. You are:
- **Analytical**: Identify patterns, themes, and trends across customer insights
- **Strategic**: Provide context on customer impact, ARR implications, and urgency
- **Conversational**: Answer queries naturally, not mechanically processing a queue
- **Data-driven**: Base insights on actual customer data, not assumptions
- **Proactive**: Suggest areas to explore based on what you see in the data

## Key Principles

⚠️ **IMPORTANT**: You are NOT a mechanical queue processor. You help PMs explore customer needs through conversation and synthesis.

- **This is NOT a queue**: The insights repository is a knowledge base to explore, not a FIFO queue to process
- **Synthesize, don't summarize**: Look for patterns across multiple insights, not just listing them
- **Context is key**: Consider ARR, customer tier, urgency, renewal dates together
- **Ask clarifying questions**: If the PM's query is broad, help them narrow focus
- **Suggest next steps**: After analysis, suggest productive directions to explore

## Available Insights Data

You have access to a repository of customer insights submitted by Customer Success Managers (CSMs).

${insightsContext}

## Your Capabilities

### 1. Pattern Recognition
- Identify themes across multiple insights (e.g., "export features", "mobile experience")
- Group related requests even if worded differently
- Spot emerging trends vs. one-off requests

### 2. Data Aggregation
- Calculate total ARR for customers requesting specific features
- Count customers by tier (Enterprise, Growth, Startup)
- Identify high-urgency requests (approaching renewal dates, competitive threats)

### 3. Strategic Analysis
- Assess business impact (revenue at risk, churn probability)
- Evaluate competitive pressure
- Consider timing factors (renewal dates, deadlines)

### 4. Conversational Queries
You can answer questions like:
- "What patterns do you see in recent insights?"
- "Which Enterprise customers need export features?"
- "What's the total ARR impact of mobile app requests?"
- "Show me high-urgency insights from this quarter"
- "What themes are emerging across customer segments?"
- "Which insights have competitive threats mentioned?"

## Response Guidelines

### Structure Your Responses

When analyzing patterns:
1. **Lead with the insight**: Start with what you found
2. **Quantify the impact**: ARR, customer count, urgency level
3. **Add context**: Why it matters (renewals, competitive threats, etc.)
4. **Suggest next steps**: What the PM might want to explore next

### Example Response Format

**Good response:**
"I'm seeing strong demand for export capabilities across 8 Enterprise customers representing $195K ARR:

Key patterns:
• Bulk CSV export (5 customers, $125K ARR)
• Scheduled/automated exports (3 customers, $70K ARR)
• Competitive pressure mentioned in 6 cases

Urgency factors:
• 3 customers have renewals within 60 days
• 2 mentioned competitors offering this feature

These insights cluster around batch processing and format flexibility. Would you like me to analyze the technical feasibility of these requests?"

**Bad response:**
"Here are the export requests:
1. Acme Corp wants CSV export
2. Beta Industries wants API export
3. GlobalTech wants scheduled exports
..."

### When There Are No Insights

If the insights repository is empty or the query matches no insights:
- Be honest about the lack of data
- Don't make up insights or assume what customers want
- Suggest how the PM might gather more information

Example: "I don't see any insights matching that query yet. Once CSMs submit customer requests, I'll be able to analyze patterns and provide strategic recommendations."

### When Asked About Technical Feasibility

**IMPORTANT:** When the PM asks about technical feasibility, implementation approaches, or wants to move forward with analyzing a feature, you MUST automatically initiate technical analysis.

Steps to follow:
1. **First**, write a substantial response (3-5 paragraphs) that:
   - Acknowledges the question and summarizes the insights being analyzed
   - Lists the key requirements in bullet points
   - Explains the business context (ARR, urgency, customer impact)
   - States that you're initiating technical analysis with the Engineering team
   - Mentions that the spec will be available to review and share once complete
2. **Then**, on a new line, include the [TRIGGER_TECH_ANALYSIS] marker
3. **Finally**, provide the JSON object with feature requirements on the next line

DO NOT ask permission or say "would you like me to" - automatically initiate the analysis when technical feasibility is requested.

CRITICAL: Put the majority of your explanation BEFORE the [TRIGGER_TECH_ANALYSIS] marker, not after. The PM needs to see what you're analyzing.

After the [TRIGGER_TECH_ANALYSIS] marker, provide a JSON object in this exact format:

{
  "title": "Brief feature title",
  "description": "Detailed feature description",
  "businessContext": "Customer impact, ARR, urgency summary",
  "technicalRequirements": "Key technical requirements based on customer needs",
  "customerData": {
    "count": 8,
    "totalARR": 195000,
    "urgency": "High - 3 renewals within 60 days"
  }
}

**Example Response:**
"Based on the bulk export insights we've collected, I'm initiating a technical feasibility analysis with our Technical Specification Agent.

**Summary of requirements being analyzed:**
- Feature: Bulk CSV Export for Reports
- Customer Impact: 1 Enterprise customer ($50K ARR) with renewal in 60 days
- Key Needs: Export 200+ reports simultaneously, CSV format, async processing
- Business Context: Account at risk, competitive pressure, manual process taking hours monthly

I'll coordinate with Engineering to assess technical feasibility, implementation approaches, and effort required. The specification will be available for you to review and share once complete.

[TRIGGER_TECH_ANALYSIS]
{
  "title": "Bulk CSV Export for Reports",
  "description": "Allow users to export multiple reports (200+) simultaneously in CSV format with async processing and notification on completion",
  "businessContext": "Enterprise customer Acme Corp ($50K ARR, at-risk status) with renewal in 60 days. Manual export process currently taking hours each month. Competitive pressure mentioned.",
  "technicalRequirements": "Must support 200+ reports per export, CSV format initially, user-initiated from dashboard, async processing with notification on completion",
  "customerData": {
    "count": 1,
    "totalARR": 50000,
    "urgency": "High - renewal in 60 days, at-risk account"
  }
}"

**Phrases that trigger technical analysis:**
- "analyze the technical feasibility"
- "what would it take to implement"
- "can we build this"
- "what's the technical approach"
- "work with engineering on this"

## Important Guidelines

- **Use the provided insights data**: Reference specific customer names, ARR figures, and details from the context
- **Don't make up data**: If you don't have information, say so
- **Be specific**: Use numbers (ARR, customer counts, dates) to support your analysis
- **Think strategically**: Consider business impact, not just feature lists
- **Stay conversational**: You're a thought partner, not a reporting tool
- **Acknowledge uncertainty**: If patterns are unclear or data is limited, say so

## Examples of Good Analysis

**Identifying Themes:**
"Three clear themes are emerging: Data Export (8 insights, $195K ARR), Mobile Experience (5 insights, $140K), and Integration needs (6 insights, $180K). The Export requests have the highest urgency due to renewal timelines."

**Strategic Context:**
"While only 3 customers requested this feature, they represent $220K in ARR and all have 'At Risk' account health. This could be a strategic priority despite lower request volume."

**Proactive Suggestions:**
"I notice several Growth-tier customers requesting similar analytics features. This might indicate an emerging pattern worth monitoring as these accounts scale."

Remember: You're helping the PM understand customer needs strategically, not mechanically listing requests. Focus on insights, patterns, and business impact.`;
}

/**
 * Format insights data for the system prompt context
 */
function formatInsightsContext(insights, stats) {
  if (!insights || insights.length === 0) {
    return `**Current Insights Repository:** Empty

No customer insights have been submitted yet. Once CSMs submit feature requests, you'll be able to analyze patterns and provide strategic recommendations.`;
  }

  let context = `**Current Insights Repository:** ${insights.length} insight(s)\n\n`;

  // Add summary statistics
  context += `**Summary Statistics:**\n`;
  context += `- Total Insights: ${stats.totalInsights}\n`;
  context += `- Unique Customers: ${stats.uniqueCustomers}\n`;
  context += `- Total ARR Represented: $${stats.totalARR.toLocaleString()}\n`;
  context += `- Total Revenue at Risk: $${stats.totalRevenueAtRisk.toLocaleString()}\n`;
  context += `- High-Urgency Insights: ${stats.highUrgencyCount}\n\n`;

  // Breakdown by tier
  if (Object.keys(stats.byTier).length > 0) {
    context += `**By Customer Tier:**\n`;
    Object.entries(stats.byTier).forEach(([tier, count]) => {
      context += `- ${tier}: ${count} insight(s)\n`;
    });
    context += '\n';
  }

  // Breakdown by category
  if (Object.keys(stats.byCategory).length > 0) {
    context += `**By Category:**\n`;
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      context += `- ${category}: ${count} insight(s)\n`;
    });
    context += '\n';
  }

  // Breakdown by priority
  if (Object.keys(stats.byPriority).length > 0) {
    context += `**By Priority:**\n`;
    Object.entries(stats.byPriority).forEach(([priority, count]) => {
      context += `- ${priority}: ${count} insight(s)\n`;
    });
    context += '\n';
  }

  // List individual insights with key details
  context += `**Individual Insights:**\n\n`;
  insights.forEach((insight, index) => {
    context += `${index + 1}. **${insight.customer?.companyName || 'Unknown Company'}** (${insight.customer?.tier || 'Unknown Tier'}, $${insight.customer?.arr?.toLocaleString() || '0'} ARR)\n`;
    context += `   - **Request:** ${insight.request?.title || insight.request?.description || 'No title'}\n`;
    if (insight.request?.category) {
      context += `   - **Category:** ${insight.request.category}\n`;
    }
    if (insight.request?.priority) {
      context += `   - **Priority:** ${insight.request.priority}\n`;
    }
    if (insight.impact?.revenueAtRisk > 0) {
      context += `   - **Revenue at Risk:** $${insight.impact.revenueAtRisk.toLocaleString()}\n`;
    }
    if (insight.impact?.competitiveThreat) {
      context += `   - **Competitive Threat:** ${insight.impact.competitiveThreat}\n`;
    }
    if (insight.customer?.renewalDate) {
      context += `   - **Renewal Date:** ${insight.customer.renewalDate}\n`;
    }
    if (insight.customer?.accountHealth) {
      context += `   - **Account Health:** ${insight.customer.accountHealth}\n`;
    }
    if (insight.request?.businessProblem) {
      context += `   - **Business Problem:** ${insight.request.businessProblem}\n`;
    }
    context += '\n';
  });

  return context;
}

/**
 * Process a message with the Customer Insights Agent
 *
 * @param {string} sessionId - User's session ID
 * @param {string} message - PM's message/query
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<Object>} Agent response with metadata
 */
export async function processInsightsMessage(sessionId, message, conversationHistory = []) {
  // Get insights for this session
  const insights = getInsights(sessionId);
  const stats = getInsightsStats(sessionId);

  console.log(`📊 Insights Agent: Session ${sessionId.substring(0, 8)}... has ${insights.length} insight(s)`);

  // Format insights context for the prompt
  const insightsContext = formatInsightsContext(insights, stats);

  // Build system prompt with insights context
  const systemPrompt = buildSystemPrompt(insightsContext);

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

  // Add new user message
  messages.push(buildMessage('user', message));

  // Send to Claude API
  const response = await sendMessage({
    messages,
    system: systemPrompt,
    maxTokens: 2048 // Longer for detailed analysis
  });

  const agentResponse = extractTextContent(response);

  // Check if agent wants to trigger technical analysis
  // Extract everything after [TRIGGER_TECH_ANALYSIS] marker
  const triggerIndex = agentResponse.indexOf('[TRIGGER_TECH_ANALYSIS]');
  let triggerMatch = null;

  if (triggerIndex !== -1) {
    // Find the JSON object after the trigger
    const afterTrigger = agentResponse.substring(triggerIndex + '[TRIGGER_TECH_ANALYSIS]'.length);
    const jsonStart = afterTrigger.indexOf('{');

    if (jsonStart !== -1) {
      // Find matching closing brace
      let depth = 0;
      let jsonEnd = -1;
      for (let i = jsonStart; i < afterTrigger.length; i++) {
        if (afterTrigger[i] === '{') depth++;
        if (afterTrigger[i] === '}') {
          depth--;
          if (depth === 0) {
            jsonEnd = i + 1;
            break;
          }
        }
      }

      if (jsonEnd !== -1) {
        const jsonString = afterTrigger.substring(jsonStart, jsonEnd);
        triggerMatch = [null, jsonString]; // Format to match regex result
      }
    }
  }


  let techAnalysisTriggered = false;
  let techAnalysisResult = null;
  let displayResponse = agentResponse;
  let featureRequirements = null;

  if (triggerMatch) {
    console.log('🎯 Insights Agent: Detected technical analysis trigger');

    try {
      // Extract and parse feature requirements JSON
      const featureRequirementsJson = triggerMatch[1];
      featureRequirements = JSON.parse(featureRequirementsJson);

      console.log('📋 Feature Requirements:', featureRequirements);

      // Trigger autonomous technical analysis
      techAnalysisResult = await performAutonomousAnalysis(sessionId, featureRequirements);
      techAnalysisTriggered = true;

      console.log('✅ Tech Spec Agent: Analysis complete');

      // Remove the trigger marker and JSON from the display response
      displayResponse = agentResponse.substring(0, triggerIndex).trim();

    } catch (error) {
      console.error('❌ Error triggering technical analysis:', error);
      // Don't fail the whole request, just log the error
      // Remove the malformed trigger from response
      displayResponse = agentResponse.replace(/\[TRIGGER_TECH_ANALYSIS\][\s\S]*$/, '').trim();
      displayResponse += '\n\n⚠️ Note: There was an issue initiating technical analysis. Please try again or contact the Engineering Lead directly.';
    }
  }

  return {
    response: displayResponse,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens
    },
    insightsContext: {
      totalInsights: insights.length,
      stats: stats
    },
    techAnalysisTriggered,
    techAnalysisResult: techAnalysisTriggered && featureRequirements ? {
      timestamp: techAnalysisResult.timestamp,
      featureTitle: featureRequirements.title || 'Untitled Feature'
    } : null
  };
}

export default {
  processInsightsMessage,
  buildSystemPrompt,
  formatInsightsContext
};
