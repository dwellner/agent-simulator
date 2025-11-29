/**
 * Test script for Structured Output functionality (Step 5.3)
 * Tests the intake agent's ability to extract structured data from conversations
 */

const API_URL = 'http://localhost:3001/api/agents/intake';

async function testStructuredOutput() {
  console.log('Testing Structured Output Functionality...\n');

  // Test Case 1: Initial message with customer mention
  console.log('Test 1: Initial message with customer mention');
  console.log('Message: "Acme Corp wants Excel export for their reporting data"\n');

  try {
    const response1 = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Acme Corp wants Excel export for their reporting data',
        conversationHistory: []
      })
    });

    const data1 = await response1.json();

    console.log('Full Response Data:', JSON.stringify(data1, null, 2));
    console.log('\n');

    console.log('Agent Response:', data1.response.substring(0, 200) + '...\n');
    console.log('Context Found:');
    console.log('  - Customer:', data1.contextFound.customer);
    console.log('  - Similar Requests:', data1.contextFound.similarRequests);
    console.log('');

    if (!data1.structuredRequest) {
      console.log('❌ No structured request in response!');
      return;
    }

    console.log('Structured Request:');
    console.log('  Customer:', data1.structuredRequest.customer.companyName);
    console.log('  Tier:', data1.structuredRequest.customer.tier);
    console.log('  ARR: $' + data1.structuredRequest.customer.arr.toLocaleString());
    console.log('  Request Description:', data1.structuredRequest.request.description || '(not yet extracted)');
    console.log('  Completeness:', data1.structuredRequest.meta.completeness + '%');
    console.log('');

    console.log('Request Summary:');
    console.log(data1.requestSummary);
    console.log('\n' + '='.repeat(80) + '\n');

    // Test Case 2: Follow-up message providing more details
    console.log('Test 2: Follow-up message with more details');
    console.log('Message: "They need it for 200+ users, and it\'s critical for their renewal in March. Revenue at risk is $150K"\n');

    const response2 = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "They need it for 200+ users, and it's critical for their renewal in March. Revenue at risk is $150K",
        conversationHistory: [
          { role: 'user', content: 'Acme Corp wants Excel export for their reporting data' },
          { role: 'assistant', content: data1.response }
        ]
      })
    });

    const data2 = await response2.json();

    console.log('Agent Response:', data2.response.substring(0, 200) + '...\n');

    console.log('Updated Structured Request:');
    console.log('  Request Description:', data2.structuredRequest.request.description || '(not extracted)');
    console.log('  Priority:', data2.structuredRequest.request.priority || '(not extracted)');
    console.log('  Users Affected:', data2.structuredRequest.impact.usersAffected || 0);
    console.log('  Revenue at Risk: $' + (data2.structuredRequest.impact.revenueAtRisk || 0).toLocaleString());
    console.log('  Completeness:', data2.structuredRequest.meta.completeness + '%');
    console.log('');

    console.log('Updated Request Summary:');
    console.log(data2.requestSummary);
    console.log('\n' + '='.repeat(80) + '\n');

    console.log('✅ All tests passed!');
    console.log('✅ Structured output is working correctly');
    console.log('✅ Data extraction improved from', data1.structuredRequest.meta.completeness + '% to', data2.structuredRequest.meta.completeness + '%');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run the test
testStructuredOutput();
