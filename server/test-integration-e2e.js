/**
 * Integration Test: End-to-End Workflow
 * Tests the complete CSM → PM → Engineering workflow with agent-to-agent coordination
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

async function testEndToEndWorkflow() {
  console.log('\n=== Testing End-to-End Workflow ===\n');

  try {
    // ===== STAGE 1: CSM - Request Intake =====
    console.log('STAGE 1: CSM - Request Intake Agent');
    console.log('─'.repeat(50));

    const csmMessage = 'Our Enterprise customer Acme Corp ($150K ARR) urgently needs a bulk CSV export feature. They want to export 200+ reports simultaneously with custom column selection. Their contract renewal is in 60 days and they mentioned that competitors already offer this. This is blocking their workflow efficiency.';

    const intakeResponse = await fetch(`${BASE_URL}/api/agents/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: csmMessage,
        conversationHistory: []
      })
    });

    assert(intakeResponse.ok, 'CSM intake request successful');
    const intakeData = await intakeResponse.json();
    assert(intakeData.structuredRequest, 'Structured request generated');

    const structuredRequest = intakeData.structuredRequest;
    console.log(`  Customer: ${structuredRequest.customer.companyName}`);
    console.log(`  Feature: ${structuredRequest.request.title}`);
    console.log(`  Completeness: ${structuredRequest.meta.completeness}%`);

    // Submit insight to PM
    const insight = {
      ...structuredRequest,
      insightId: `e2e-test-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      submittedBy: 'CSM'
    };

    const submitResponse = await fetch(`${BASE_URL}/api/insights/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ insight })
    });

    assert(submitResponse.ok, 'Insight submission successful');
    console.log('  ✓ Insight submitted to PM\n');

    // ===== STAGE 2: PM - Customer Insights Analysis =====
    console.log('STAGE 2: PM - Customer Insights Agent');
    console.log('─'.repeat(50));

    // Query for patterns
    const pmQueryResponse = await fetch(`${BASE_URL}/api/agents/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What are the highest priority customer requests based on ARR and urgency?',
        conversationHistory: []
      })
    });

    assert(pmQueryResponse.ok, 'PM query successful');
    const pmData = await pmQueryResponse.json();
    assert(pmData.insightsContext, 'Insights context provided');
    console.log(`  Insights analyzed: ${pmData.insightsContext.totalInsights}`);

    // Request technical feasibility (triggers Tech Agent)
    console.log('\n  Requesting technical feasibility analysis...');
    const feasibilityResponse = await fetch(`${BASE_URL}/api/agents/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Please analyze the technical feasibility of implementing the bulk CSV export feature that Acme Corp requested',
        conversationHistory: [
          { role: 'user', content: 'What are the highest priority...' },
          { role: 'assistant', content: pmData.response }
        ]
      })
    });

    assert(feasibilityResponse.ok, 'Feasibility request successful');
    const feasibilityData = await feasibilityResponse.json();

    if (feasibilityData.techAnalysisTriggered) {
      console.log('  ✓ Tech Agent automatically triggered!');
      assert(feasibilityData.techAnalysisResult, 'Tech analysis result received');
      console.log(`  Feature: ${feasibilityData.techAnalysisResult.featureTitle}`);
      console.log(`  Timestamp: ${feasibilityData.techAnalysisResult.timestamp}`);
    } else {
      console.log('  ℹ Tech analysis not auto-triggered');
    }

    console.log('');

    // ===== STAGE 3: Engineering - Technical Review =====
    console.log('STAGE 3: Engineering - Technical Specification Agent');
    console.log('─'.repeat(50));

    const engQueryResponse = await fetch(`${BASE_URL}/api/agents/techspec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What are the implementation approaches for the bulk CSV export feature?',
        conversationHistory: [],
        mode: 'conversational'
      })
    });

    assert(engQueryResponse.ok, 'Engineering query successful');
    const engData = await engQueryResponse.json();
    assert(engData.response, 'Tech spec response received');
    assert(engData.codebaseContext, 'Codebase context included');
    console.log(`  Components reviewed: ${engData.codebaseContext.componentsCount}`);
    console.log(`  Response length: ${engData.response.length} chars`);

    // Follow-up technical question
    const followupResponse = await fetch(`${BASE_URL}/api/agents/techspec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What are the main technical risks and how should we mitigate them?',
        conversationHistory: [
          { role: 'user', content: 'What are the implementation approaches...' },
          { role: 'assistant', content: engData.response }
        ],
        mode: 'conversational'
      })
    });

    assert(followupResponse.ok, 'Follow-up query successful');
    const followupData = await followupResponse.json();
    assert(followupData.response, 'Follow-up response received');
    console.log('  ✓ Technical risks identified\n');

    // ===== STAGE 4: Verification =====
    console.log('STAGE 4: Workflow Verification');
    console.log('─'.repeat(50));

    // Verify insights are retrievable
    const insightsResponse = await fetch(`${BASE_URL}/api/insights`);
    assert(insightsResponse.ok, 'Insights retrieval successful');
    const insightsData = await insightsResponse.json();
    assert(insightsData.insights.length > 0, 'Insights stored correctly');

    const submittedInsight = insightsData.insights.find(i => i.insightId === insight.insightId);
    assert(submittedInsight, 'Submitted insight found in storage');
    console.log('  ✓ Data persistence verified');

    // Verify session state
    assert(insightsData.totalInsights > 0, 'Session state maintained');
    console.log('  ✓ Session state maintained');

    // Verify agent responses are contextual
    assert(pmData.response.length > 100, 'PM responses are substantive');
    assert(engData.response.length > 100, 'Engineering responses are substantive');
    console.log('  ✓ Agent responses are contextual');

    console.log('\n✅ End-to-End Workflow: ALL TESTS PASSED\n');
    console.log('Summary:');
    console.log(`  • CSM submitted structured request`);
    console.log(`  • PM analyzed ${insightsData.totalInsights} customer insights`);
    console.log(`  • Tech Agent ${feasibilityData.techAnalysisTriggered ? 'automatically triggered' : 'available for queries'}`);
    console.log(`  • Engineering reviewed technical approach`);
    console.log(`  • All data persisted correctly\n`);

    return true;

  } catch (error) {
    console.error('\n❌ End-to-End Workflow: TEST FAILED');
    console.error(error.message);
    console.error(error.stack);
    return false;
  }
}

// Run tests
async function main() {
  console.log('Starting End-to-End Integration Test...');
  console.log('Make sure the server is running on http://localhost:3001\n');

  const success = await testEndToEndWorkflow();
  process.exit(success ? 0 : 1);
}

main();
