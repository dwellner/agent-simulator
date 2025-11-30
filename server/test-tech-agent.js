/**
 * Test script for Technical Specification Agent
 * Run with: node server/test-tech-agent.js
 */

import dotenv from 'dotenv';
import { processTechSpecMessage, performAutonomousAnalysis } from './agents/techSpecAgent.js';

// Load environment variables
dotenv.config();

// Test session ID
const TEST_SESSION_ID = 'test-session-' + Date.now();

/**
 * Test 1: Conversational mode with simple query
 */
async function testConversationalMode() {
  console.log('\n========================================');
  console.log('TEST 1: Conversational Mode - Simple Query');
  console.log('========================================\n');

  const message = "We need to add bulk CSV export for reports. Can you analyze the technical feasibility?";

  try {
    const result = await processTechSpecMessage(TEST_SESSION_ID, message, [], 'conversational');

    console.log('✅ Agent Response:');
    console.log('---');
    console.log(result.response);
    console.log('---');
    console.log(`\n📊 Token Usage: ${result.usage.inputTokens} input, ${result.usage.outputTokens} output`);
    console.log(`🔧 Codebase Components: ${result.codebaseContext.componentsCount}`);

    return result;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
}

/**
 * Test 2: Autonomous analysis mode
 */
async function testAutonomousMode() {
  console.log('\n========================================');
  console.log('TEST 2: Autonomous Analysis Mode');
  console.log('========================================\n');

  const featureRequirements = {
    title: 'Bulk CSV Export for Reports',
    description: 'Allow users to export multiple reports (200+) simultaneously in CSV format',
    businessContext: 'Enterprise customers requesting this feature: 8 customers representing $195K ARR. 3 have renewal dates within 60 days. Competitive pressure mentioned in 6 cases.',
    technicalRequirements: 'Must support 200+ reports per export, CSV format only (initial scope), user-initiated from dashboard, async processing with notification on completion.',
    customerData: {
      count: 8,
      totalARR: 195000,
      urgency: 'High - 3 renewals within 60 days'
    }
  };

  try {
    const result = await performAutonomousAnalysis(TEST_SESSION_ID, featureRequirements);

    console.log('✅ Autonomous Analysis Complete:');
    console.log('---');
    console.log(result.response);
    console.log('---');
    console.log(`\n📊 Token Usage: ${result.usage.inputTokens} input, ${result.usage.outputTokens} output`);
    console.log(`⏰ Analysis Timestamp: ${result.timestamp}`);

    return result;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
}

/**
 * Test 3: Conversational refinement after autonomous analysis
 */
async function testRefinementMode() {
  console.log('\n========================================');
  console.log('TEST 3: Conversational Refinement');
  console.log('========================================\n');

  // First, get initial analysis
  const featureRequirements = 'Bulk CSV export for reports - users need to export 200+ reports simultaneously';

  const initialResult = await processTechSpecMessage(
    TEST_SESSION_ID,
    `Analyze this feature: ${featureRequirements}`,
    [],
    'autonomous'
  );

  console.log('📋 Initial Analysis Complete');
  console.log(`Token usage: ${initialResult.usage.inputTokens} in, ${initialResult.usage.outputTokens} out\n`);

  // Now refine with follow-up question
  const conversationHistory = [
    { role: 'user', content: `Analyze this feature: ${featureRequirements}` },
    { role: 'assistant', content: initialResult.response }
  ];

  const refinementQuestion = "What if we used the existing batch processor instead of creating a new queue? What are the tradeoffs?";

  try {
    const refinementResult = await processTechSpecMessage(
      TEST_SESSION_ID,
      refinementQuestion,
      conversationHistory,
      'conversational'
    );

    console.log('✅ Refinement Response:');
    console.log('---');
    console.log(refinementResult.response);
    console.log('---');
    console.log(`\n📊 Token Usage: ${refinementResult.usage.inputTokens} input, ${refinementResult.usage.outputTokens} output`);

    return refinementResult;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
}

/**
 * Test 4: Technical depth and component references
 */
async function testTechnicalDepth() {
  console.log('\n========================================');
  console.log('TEST 4: Technical Depth & Component References');
  console.log('========================================\n');

  const message = "For the bulk export feature, which specific components should we use? I want exact paths and dependencies.";

  const conversationHistory = [
    {
      role: 'user',
      content: 'We need bulk CSV export for 200+ reports'
    },
    {
      role: 'assistant',
      content: 'I recommend using Approach A: Extend Export API with Async Queue, leveraging the Batch Processor for queue management.'
    }
  ];

  try {
    const result = await processTechSpecMessage(
      TEST_SESSION_ID,
      message,
      conversationHistory,
      'conversational'
    );

    console.log('✅ Technical Detail Response:');
    console.log('---');
    console.log(result.response);
    console.log('---');

    // Check if response includes specific component references
    const hasComponentReferences = result.response.includes('/api/v1/exports') ||
                                   result.response.includes('/services/batch-processor') ||
                                   result.response.includes('Export API');

    console.log(`\n🔍 Contains specific component references: ${hasComponentReferences ? '✅ YES' : '❌ NO'}`);
    console.log(`📊 Token Usage: ${result.usage.inputTokens} input, ${result.usage.outputTokens} output`);

    return result;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('\n🧪 Starting Tech Spec Agent Tests...\n');

  if (!process.env.CLAUDE_API_KEY) {
    console.error('❌ Error: CLAUDE_API_KEY not found in environment variables');
    console.error('Please set CLAUDE_API_KEY in your .env file');
    process.exit(1);
  }

  try {
    // Test 1: Conversational mode
    await testConversationalMode();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting pause

    // Test 2: Autonomous mode
    await testAutonomousMode();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting pause

    // Test 3: Refinement conversation
    await testRefinementMode();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting pause

    // Test 4: Technical depth
    await testTechnicalDepth();

    console.log('\n========================================');
    console.log('✅ ALL TESTS PASSED');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n========================================');
    console.error('❌ TEST SUITE FAILED');
    console.error('========================================\n');
    console.error('Error details:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { runAllTests, testConversationalMode, testAutonomousMode, testRefinementMode, testTechnicalDepth };
