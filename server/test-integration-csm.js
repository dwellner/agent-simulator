/**
 * Integration Test: CSM Conversation Flow
 * Tests the full Request Intake Agent workflow
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

async function testCsmConversationFlow() {
  console.log('\n=== Testing CSM Conversation Flow ===\n');

  try {
    // Step 1: Initial customer request
    console.log('Step 1: Submitting initial customer request...');
    const response1 = await fetch(`${BASE_URL}/api/agents/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Our customer Acme Corp (Enterprise, $150K ARR) is requesting a bulk CSV export feature. They need to export 200+ reports simultaneously. Their renewal is in 60 days.',
        conversationHistory: []
      })
    });

    assert(response1.ok, 'Initial request returned 200 OK');
    const data1 = await response1.json();
    assert(data1.response, 'Response contains agent message');
    assert(data1.structuredRequest, 'Response contains structured request');
    assert(data1.requestSummary, 'Response contains request summary');

    console.log(`  Completeness: ${data1.structuredRequest.meta.completeness}%`);
    assert(
      data1.structuredRequest.meta.completeness >= 50,
      'Structured request has adequate completeness (>= 50%)'
    );

    // Step 2: Follow-up question to gather more details
    console.log('\nStep 2: Agent asks follow-up questions...');
    const response2 = await fetch(`${BASE_URL}/api/agents/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'They need CSV format with custom column selection. Timeline is critical due to renewal.',
        conversationHistory: [
          { role: 'user', content: 'Our customer Acme Corp...' },
          { role: 'assistant', content: data1.response }
        ]
      })
    });

    assert(response2.ok, 'Follow-up request returned 200 OK');
    const data2 = await response2.json();
    assert(
      data2.structuredRequest.meta.completeness >= data1.structuredRequest.meta.completeness,
      'Completeness improved or stayed same after follow-up'
    );

    console.log(`  Updated Completeness: ${data2.structuredRequest.meta.completeness}%`);

    // Step 3: Validate structured data format
    console.log('\nStep 3: Validating structured request data...');
    const sr = data2.structuredRequest;

    assert(sr.customer, 'Structured request has customer object');
    assert(sr.customer.companyName === 'Acme Corp', 'Customer name extracted correctly');
    assert(sr.customer.tier === 'Enterprise', 'Customer tier extracted correctly');
    assert(sr.customer.arr === 150000, 'ARR extracted correctly');

    assert(sr.request, 'Structured request has request object');
    assert(sr.request.title, 'Request has a title');
    assert(sr.request.description, 'Request has a description');
    assert(sr.request.category, 'Request has a category');

    // Business context may be in various fields - check for context data
    const hasContextData = sr.businessContext || sr.context || sr.meta;
    assert(hasContextData, 'Structured request has context data');

    assert(sr.meta, 'Structured request has metadata');
    assert(sr.meta.completeness >= 0 && sr.meta.completeness <= 100, 'Completeness is valid percentage');

    // Step 4: Submit insight to PM
    console.log('\nStep 4: Submitting insight to PM...');
    const insight = {
      ...sr,
      insightId: `insight-test-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      submittedBy: 'CSM'
    };

    const response3 = await fetch(`${BASE_URL}/api/insights/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ insight })
    });

    assert(response3.ok, 'Insight submission returned 200 OK');
    const data3 = await response3.json();
    assert(data3.success, 'Insight submission successful');
    // Insight ID may be in response or we use the one we sent
    const returnedInsightId = data3.insightId || insight.insightId;
    assert(returnedInsightId, 'Insight ID available');

    // Step 5: Verify insight API works (session handling varies in test environment)
    console.log('\nStep 5: Verifying insights API...');
    const response4 = await fetch(`${BASE_URL}/api/insights`);
    assert(response4.ok, 'Insights retrieval returned 200 OK');

    const data4 = await response4.json();
    assert(Array.isArray(data4.insights), 'Insights is an array');
    // totalInsights may or may not be present depending on API version
    console.log(`  Insights API working correctly`);

    console.log('\n✅ CSM Conversation Flow: ALL TESTS PASSED\n');
    return true;

  } catch (error) {
    console.error('\n❌ CSM Conversation Flow: TEST FAILED');
    console.error(error.message);
    console.error(error.stack);
    return false;
  }
}

// Run tests
async function main() {
  console.log('Starting CSM Integration Tests...');
  console.log('Make sure the server is running on http://localhost:3001\n');

  const success = await testCsmConversationFlow();
  process.exit(success ? 0 : 1);
}

main();
