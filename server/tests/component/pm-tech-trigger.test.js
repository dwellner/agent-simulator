/**
 * Test script for PM triggering Tech Spec Agent
 * Run with: node server/test-pm-tech-trigger.js
 */

import dotenv from 'dotenv';
import { processInsightsMessage } from './agents/insightsAgent.js';
import { submitInsight } from './services/insightsService.js';

// Load environment variables
dotenv.config();

// Test session ID
const TEST_SESSION_ID = 'test-pm-tech-trigger-' + Date.now();

/**
 * Setup: Add some insights to the repository
 */
async function setupInsights() {
  console.log('\n📝 Setting up test insights...\n');

  const testInsights = [
    {
      customer: {
        companyName: 'Acme Corp',
        tier: 'Enterprise',
        arr: 50000,
        renewalDate: '2025-01-15',
        accountHealth: 'At Risk'
      },
      request: {
        title: 'Bulk CSV Export',
        description: 'Need to export 200+ reports simultaneously',
        category: 'Data Export',
        priority: 'High'
      },
      impact: {
        revenueAtRisk: 50000,
        competitiveThreat: 'Competitor offers this feature'
      }
    },
    {
      customer: {
        companyName: 'Beta Industries',
        tier: 'Enterprise',
        arr: 35000,
        renewalDate: '2025-01-20',
        accountHealth: 'Healthy'
      },
      request: {
        title: 'Automated Export API',
        description: 'API endpoint for automated report exports',
        category: 'Data Export',
        priority: 'High'
      },
      impact: {
        revenueAtRisk: 0,
        competitiveThreat: ''
      }
    },
    {
      customer: {
        companyName: 'GlobalTech',
        tier: 'Enterprise',
        arr: 40000,
        renewalDate: '2025-02-01',
        accountHealth: 'Healthy'
      },
      request: {
        title: 'Scheduled Report Exports',
        description: 'Schedule recurring report exports',
        category: 'Data Export',
        priority: 'Medium'
      },
      impact: {
        revenueAtRisk: 0,
        competitiveThreat: ''
      }
    }
  ];

  // Submit each insight
  for (const insight of testInsights) {
    submitInsight(TEST_SESSION_ID, insight);
    console.log(`✓ Added insight: ${insight.customer.companyName} - ${insight.request.title}`);
  }

  console.log(`\n✅ ${testInsights.length} insights added to session\n`);
}

/**
 * Test: PM asks about patterns (should NOT trigger tech agent)
 */
async function testPatternQuery() {
  console.log('\n========================================');
  console.log('TEST 1: Pattern Query (No Tech Trigger)');
  console.log('========================================\n');

  const message = "What patterns do you see in recent insights?";

  try {
    const result = await processInsightsMessage(TEST_SESSION_ID, message, []);

    console.log('✅ Agent Response:');
    console.log('---');
    console.log(result.response);
    console.log('---');
    console.log(`\n📊 Token Usage: ${result.usage.inputTokens} input, ${result.usage.outputTokens} output`);
    console.log(`🎯 Tech Analysis Triggered: ${result.techAnalysisTriggered ? 'YES' : 'NO'}`);

    if (result.techAnalysisTriggered) {
      console.log('❌ ERROR: Tech analysis should NOT be triggered for pattern queries');
      return false;
    }

    console.log('✅ Test passed: No tech trigger for pattern query');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

/**
 * Test: PM asks about technical feasibility (SHOULD trigger tech agent)
 */
async function testTechnicalFeasibilityQuery() {
  console.log('\n========================================');
  console.log('TEST 2: Technical Feasibility Query (Should Trigger Tech)');
  console.log('========================================\n');

  const conversationHistory = [
    {
      role: 'user',
      content: 'What patterns do you see in recent insights?'
    },
    {
      role: 'assistant',
      content: 'I see a strong pattern around Data Export features from 3 Enterprise customers representing $125K ARR...'
    }
  ];

  const message = "Can you analyze the technical feasibility of implementing bulk export features?";

  try {
    const result = await processInsightsMessage(TEST_SESSION_ID, message, conversationHistory);

    console.log('✅ Agent Response:');
    console.log('---');
    console.log(result.response);
    console.log('---');
    console.log(`\n📊 Token Usage: ${result.usage.inputTokens} input, ${result.usage.outputTokens} output`);
    console.log(`🎯 Tech Analysis Triggered: ${result.techAnalysisTriggered ? 'YES ✅' : 'NO ❌'}`);

    if (result.techAnalysisTriggered) {
      console.log(`📋 Feature: ${result.techAnalysisResult.featureTitle}`);
      console.log(`⏰ Timestamp: ${result.techAnalysisResult.timestamp}`);
      console.log('✅ Test passed: Tech analysis triggered successfully');
      return true;
    } else {
      console.log('❌ ERROR: Tech analysis should be triggered for feasibility queries');
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('\n🧪 Starting PM → Tech Agent Trigger Tests...\n');

  if (!process.env.CLAUDE_API_KEY) {
    console.error('❌ Error: CLAUDE_API_KEY not found in environment variables');
    console.error('Please set CLAUDE_API_KEY in your .env file');
    process.exit(1);
  }

  try {
    // Setup test data
    await setupInsights();

    // Allow a moment for setup
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 1: Pattern query (no trigger)
    const test1Passed = await testPatternQuery();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting pause

    // Test 2: Technical feasibility query (should trigger)
    const test2Passed = await testTechnicalFeasibilityQuery();

    console.log('\n========================================');
    if (test1Passed && test2Passed) {
      console.log('✅ ALL TESTS PASSED');
    } else {
      console.log('❌ SOME TESTS FAILED');
    }
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

export { runAllTests, testPatternQuery, testTechnicalFeasibilityQuery };
