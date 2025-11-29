import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendMessage, streamMessage, extractTextContent, buildMessage } from './claudeApi.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('Testing Claude API Service...\n');

// Test 1: Basic message sending
async function testBasicMessage() {
  console.log('Test 1: Basic message sending');
  console.log('================================');

  try {
    const messages = [
      buildMessage('user', 'Say "Hello, World!" and nothing else.')
    ];

    const response = await sendMessage({
      messages,
      maxTokens: 50
    });

    const text = extractTextContent(response);
    console.log('✓ Response received:', text);
    console.log('✓ Basic message test passed\n');
    return true;
  } catch (error) {
    console.error('✗ Basic message test failed:', error.message);
    return false;
  }
}

// Test 2: Streaming response
async function testStreaming() {
  console.log('Test 2: Streaming response');
  console.log('================================');

  try {
    const messages = [
      buildMessage('user', 'Count from 1 to 5, one number per line.')
    ];

    let fullResponse = '';
    process.stdout.write('Streaming: ');

    for await (const chunk of streamMessage({ messages, maxTokens: 100 })) {
      process.stdout.write(chunk);
      fullResponse += chunk;
    }

    console.log('\n✓ Streaming test passed\n');
    return true;
  } catch (error) {
    console.error('\n✗ Streaming test failed:', error.message);
    return false;
  }
}

// Test 3: System prompt
async function testSystemPrompt() {
  console.log('Test 3: System prompt');
  console.log('================================');

  try {
    const messages = [
      buildMessage('user', 'What is your role?')
    ];

    const response = await sendMessage({
      messages,
      system: 'You are a helpful assistant that always responds in exactly 5 words.',
      maxTokens: 50
    });

    const text = extractTextContent(response);
    console.log('✓ Response received:', text);
    console.log('✓ System prompt test passed\n');
    return true;
  } catch (error) {
    console.error('✗ System prompt test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Claude API Key configured:', !!process.env.CLAUDE_API_KEY);
  if (process.env.CLAUDE_API_KEY) {
    console.log('API Key starts with:', process.env.CLAUDE_API_KEY.substring(0, 7) + '...');
  }
  console.log('');

  if (!process.env.CLAUDE_API_KEY) {
    console.error('ERROR: CLAUDE_API_KEY environment variable not set');
    process.exit(1);
  }

  const results = [];

  results.push(await testBasicMessage());
  results.push(await testStreaming());
  results.push(await testSystemPrompt());

  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;

  console.log('================================');
  console.log(`Test Results: ${passedTests}/${totalTests} passed`);
  console.log('================================');

  if (passedTests === totalTests) {
    console.log('✓ All tests passed! Claude API service is working correctly.');
    process.exit(0);
  } else {
    console.log('✗ Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

runTests();
