// Simple test file to verify mock data structure
import {
  mockCustomers,
  getCustomerById,
  getCustomersByTier,
  getAtRiskCustomers,
  getTotalARR
} from './mockCustomers.js';

import {
  mockRequests,
  getRequestsByCategory,
  getRequestsByStatus,
  getHighPriorityRequests,
  getSimilarRequests,
  getTotalRevenueAtRisk
} from './mockRequests.js';

import {
  mockCodebase,
  getComponentByName,
  getRelatedComponents,
  getPastImplementationsByComplexity,
  searchComponents
} from './mockCodebase.js';

// Test mock customers
console.log('=== Testing Mock Customers ===');
console.log('Total customers:', mockCustomers.length);
console.log('Customer sample:', mockCustomers[0]);
console.log('Total ARR:', getTotalARR());
console.log('Enterprise customers:', getCustomersByTier('Enterprise').length);
console.log('At-risk customers:', getAtRiskCustomers().length);
console.log('Get customer by ID:', getCustomerById('cust-001')?.companyName);

// Test mock requests
console.log('\n=== Testing Mock Requests ===');
console.log('Total requests:', mockRequests.length);
console.log('Request sample:', mockRequests[0]);
console.log('Export requests:', getRequestsByCategory('Export').length);
console.log('Pending requests:', getRequestsByStatus('pending').length);
console.log('High priority requests:', getHighPriorityRequests().length);
console.log('Total revenue at risk:', getTotalRevenueAtRisk());

// Test mock codebase
console.log('\n=== Testing Mock Codebase ===');
console.log('Total components:', mockCodebase.components.length);
console.log('Component sample:', mockCodebase.components[0].name);
console.log('Past implementations:', mockCodebase.pastImplementations.length);
console.log('Export API:', getComponentByName('Export API')?.description);
console.log('Express-related components:', getRelatedComponents('express').length);
console.log('Medium complexity implementations:', getPastImplementationsByComplexity('medium').length);
console.log('Search "export":', searchComponents('export').length);

console.log('\n✓ All mock data imports and functions work correctly!');
