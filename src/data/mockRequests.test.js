import { describe, it, expect } from 'vitest';
import {
  mockRequests,
  getRequestsByCategory,
  getRequestsByStatus,
  getHighPriorityRequests,
  getSimilarRequests,
  getTotalRevenueAtRisk
} from './mockRequests.js';

describe('mockRequests', () => {
  it('should export an array of requests', () => {
    expect(Array.isArray(mockRequests)).toBe(true);
    expect(mockRequests.length).toBeGreaterThan(0);
  });

  it('should have valid request structure', () => {
    const request = mockRequests[0];
    expect(request).toHaveProperty('id');
    expect(request).toHaveProperty('customerId');
    expect(request).toHaveProperty('customerSegment');
    expect(request).toHaveProperty('requestDate');
    expect(request).toHaveProperty('description');
    expect(request).toHaveProperty('category');
    expect(request).toHaveProperty('status');
    expect(request).toHaveProperty('priority');
    expect(request).toHaveProperty('revenueAtRisk');
    expect(request).toHaveProperty('urgency');
    expect(request).toHaveProperty('estimatedVolume');
    expect(request).toHaveProperty('businessImpact');
  });

  it('should have valid data types', () => {
    const request = mockRequests[0];
    expect(typeof request.id).toBe('string');
    expect(typeof request.customerId).toBe('string');
    expect(typeof request.customerSegment).toBe('string');
    expect(typeof request.requestDate).toBe('string');
    expect(typeof request.description).toBe('string');
    expect(typeof request.category).toBe('string');
    expect(typeof request.status).toBe('string');
    expect(typeof request.priority).toBe('string');
    expect(typeof request.revenueAtRisk).toBe('number');
    expect(typeof request.urgency).toBe('string');
    expect(typeof request.estimatedVolume).toBe('string');
    expect(typeof request.businessImpact).toBe('string');
  });

  it('should have valid status values', () => {
    const validStatuses = ['pending', 'in-progress', 'completed'];
    mockRequests.forEach(request => {
      expect(validStatuses).toContain(request.status);
    });
  });

  it('should have valid priority values', () => {
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    mockRequests.forEach(request => {
      expect(validPriorities).toContain(request.priority);
    });
  });

  it('should have non-negative revenue at risk', () => {
    mockRequests.forEach(request => {
      expect(request.revenueAtRisk).toBeGreaterThanOrEqual(0);
    });
  });

  it('should have valid customer segments', () => {
    const validSegments = ['Enterprise', 'Growth', 'Startup'];
    mockRequests.forEach(request => {
      expect(validSegments).toContain(request.customerSegment);
    });
  });
});

describe('getRequestsByCategory', () => {
  it('should return requests by category', () => {
    const exportRequests = getRequestsByCategory('Export');
    expect(Array.isArray(exportRequests)).toBe(true);
    exportRequests.forEach(request => {
      expect(request.category).toBe('Export');
    });
  });

  it('should return empty array for non-existent category', () => {
    const requests = getRequestsByCategory('NonExistentCategory');
    expect(requests).toEqual([]);
  });

  it('should find Authentication requests', () => {
    const requests = getRequestsByCategory('Authentication');
    expect(requests.length).toBeGreaterThan(0);
    requests.forEach(request => {
      expect(request.category).toBe('Authentication');
    });
  });
});

describe('getRequestsByStatus', () => {
  it('should return pending requests', () => {
    const requests = getRequestsByStatus('pending');
    expect(Array.isArray(requests)).toBe(true);
    requests.forEach(request => {
      expect(request.status).toBe('pending');
    });
  });

  it('should return completed requests', () => {
    const requests = getRequestsByStatus('completed');
    expect(Array.isArray(requests)).toBe(true);
    requests.forEach(request => {
      expect(request.status).toBe('completed');
    });
  });

  it('should return in-progress requests', () => {
    const requests = getRequestsByStatus('in-progress');
    expect(Array.isArray(requests)).toBe(true);
    requests.forEach(request => {
      expect(request.status).toBe('in-progress');
    });
  });

  it('should return empty array for invalid status', () => {
    const requests = getRequestsByStatus('invalid-status');
    expect(requests).toEqual([]);
  });
});

describe('getHighPriorityRequests', () => {
  it('should return high and critical priority requests', () => {
    const requests = getHighPriorityRequests();
    expect(Array.isArray(requests)).toBe(true);
    requests.forEach(request => {
      expect(['high', 'critical']).toContain(request.priority);
    });
  });

  it('should not include low or medium priority requests', () => {
    const requests = getHighPriorityRequests();
    requests.forEach(request => {
      expect(request.priority).not.toBe('low');
      expect(request.priority).not.toBe('medium');
    });
  });

  it('should have at least one high priority request in mock data', () => {
    const requests = getHighPriorityRequests();
    expect(requests.length).toBeGreaterThan(0);
  });
});

describe('getSimilarRequests', () => {
  it('should return requests with same category', () => {
    const exportRequests = getSimilarRequests('Export');
    expect(Array.isArray(exportRequests)).toBe(true);
    exportRequests.forEach(request => {
      expect(request.category).toBe('Export');
    });
  });

  it('should be same as getRequestsByCategory', () => {
    const category = 'API';
    const similarRequests = getSimilarRequests(category);
    const categoryRequests = getRequestsByCategory(category);
    expect(similarRequests).toEqual(categoryRequests);
  });
});

describe('getTotalRevenueAtRisk', () => {
  it('should calculate total revenue at risk for pending requests', () => {
    const totalRevenue = getTotalRevenueAtRisk();
    expect(typeof totalRevenue).toBe('number');
    expect(totalRevenue).toBeGreaterThanOrEqual(0);
  });

  it('should only include pending requests', () => {
    const totalRevenue = getTotalRevenueAtRisk();
    const pendingRequests = mockRequests.filter(r => r.status === 'pending');
    const expectedTotal = pendingRequests.reduce((sum, r) => sum + r.revenueAtRisk, 0);
    expect(totalRevenue).toBe(expectedTotal);
  });

  it('should not include completed or in-progress requests', () => {
    const totalRevenue = getTotalRevenueAtRisk();
    const nonPendingRevenue = mockRequests
      .filter(r => r.status !== 'pending')
      .reduce((sum, r) => sum + r.revenueAtRisk, 0);

    const allRevenue = mockRequests.reduce((sum, r) => sum + r.revenueAtRisk, 0);

    // Total revenue at risk should be less than all revenue if there are non-pending requests with revenue
    if (nonPendingRevenue > 0) {
      expect(totalRevenue).toBeLessThan(allRevenue);
    }
  });
});
