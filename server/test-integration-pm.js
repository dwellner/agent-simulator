/**
 * Integration Test: PM Query Flow
 * Tests the Customer Insights Agent workflow
 */

import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3001';

// Test utilities
function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Assertion failed: ${message}`);
  }
  console.log(`✓ ${message}`);
}

async function testPmQueryFlow() {
  console.log('\n=== Testing PM Query Flow ===\n');

  try {
    // Step 1: Submit test insights to the repository
    console.log('Step 1: Submitting test customer insights...');

    const testInsights = [
      {
        insightId: `insight-test-pm-1-${Date.now()}`,
        customer: {
          companyName: 'Acme Corp',
          tier: 'Enterprise',
          arr: 150000
        },
        request: {
          title: 'Bulk CSV Export',
          description: 'Export 200+ reports simultaneously in CSV format',
          category: 'Export'
        },
        businessContext: {
          urgency: 'Contract renewal in 60 days',
          revenueImpact: 'High - at risk of churn'
        },
        meta: { completeness: 85 },
        submittedAt: new Date().toISOString(),
        submittedBy: 'CSM'
      },
      {
        insightId: `insight-test-pm-2-${Date.now()}`,
        customer: {
          companyName: 'Global Solutions Ltd',
          tier: 'Enterprise',
          arr: 280000
        },
        request: {
          title: 'Advanced Export Features',
          description: 'Need scheduled exports and custom formatting',
          category: 'Export'
        },
        businessContext: {
          urgency: 'Expansion deal dependent',
          revenueImpact: 'High - $100K expansion at risk'
        },
        meta: { completeness: 80 },
        submittedAt: new Date().toISOString(),
        submittedBy: 'CSM'
      }
    ];

    for (const insight of testInsights) {
      const response = await fetch(`${BASE_URL}/api/insights/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insight })
      });
      assert(response.ok, `Submitted insight: ${insight.request.title}`);
    }

    // Step 2: Query for patterns across insights
    console.log('\nStep 2: Querying PM agent for patterns...');
    const response1 = await fetch(`${BASE_URL}/api/agents/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What patterns do you see in the customer insights?',
        conversationHistory: []
      })
    });

    assert(response1.ok, 'Pattern query returned 200 OK');
    const data1 = await response1.json();
    assert(data1.response, 'Response contains agent message');
    assert(data1.insightsContext, 'Response includes insights context');
    assert(data1.insightsContext.totalInsights >= 2, 'At least 2 insights in context');

    console.log(`  Insights analyzed: ${data1.insightsContext.totalInsights}`);
    console.log(`  Response length: ${data1.response.length} chars`);

    // Step 3: Query for specific customer tier
    console.log('\nStep 3: Querying for Enterprise customer insights...');
    const response2 = await fetch(`${BASE_URL}/api/agents/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Show me all insights from Enterprise customers requesting export features',
        conversationHistory: [
          { role: 'user', content: 'What patterns do you see...' },
          { role: 'assistant', content: data1.response }
        ]
      })
    });

    assert(response2.ok, 'Filtered query returned 200 OK');
    const data2 = await response2.json();
    assert(data2.response, 'Response contains filtered results');

    // Step 4: Request technical feasibility (should trigger tech agent)
    console.log('\nStep 4: Requesting technical feasibility analysis...');
    const response3 = await fetch(`${BASE_URL}/api/agents/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Can you analyze the technical feasibility of the bulk CSV export feature?',
        conversationHistory: [
          { role: 'user', content: 'What patterns...' },
          { role: 'assistant', content: data1.response },
          { role: 'user', content: 'Show me Enterprise...' },
          { role: 'assistant', content: data2.response }
        ]
      })
    });

    assert(response3.ok, 'Tech feasibility query returned 200 OK');
    const data3 = await response3.json();
    assert(data3.response, 'Response contains agent message');

    // Check if tech analysis was triggered
    if (data3.techAnalysisTriggered) {
      console.log('  ✓ Tech analysis automatically triggered!');
      assert(data3.techAnalysisResult, 'Tech analysis result included');
      assert(data3.techAnalysisResult.featureTitle, 'Feature title present in tech analysis');
      console.log(`  Feature analyzed: ${data3.techAnalysisResult.featureTitle}`);
    } else {
      console.log('  ℹ Tech analysis not triggered (may require more explicit request)');
    }

    // Step 5: Verify insights context is maintained
    console.log('\nStep 5: Verifying insights context is maintained...');
    assert(data3.insightsContext, 'Insights context included in response');
    assert(data3.insightsContext.totalInsights >= 2, 'Context includes submitted insights');

    console.log('\n✅ PM Query Flow: ALL TESTS PASSED\n');
    return true;

  } catch (error) {
    console.error('\n❌ PM Query Flow: TEST FAILED');
    console.error(error.message);
    console.error(error.stack);
    return false;
  }
}

// Run tests
async function main() {
  console.log('Starting PM Integration Tests...');
  console.log('Make sure the server is running on http://localhost:3001\n');

  const success = await testPmQueryFlow();
  process.exit(success ? 0 : 1);
}

main();
