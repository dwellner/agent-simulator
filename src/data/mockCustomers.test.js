import { describe, it, expect } from 'vitest';
import {
  mockCustomers,
  getCustomerById,
  getCustomersByTier,
  getAtRiskCustomers,
  getTotalARR,
  getCustomerByName
} from './mockCustomers.js';

describe('mockCustomers', () => {
  it('should export an array of customers', () => {
    expect(Array.isArray(mockCustomers)).toBe(true);
    expect(mockCustomers.length).toBeGreaterThan(0);
  });

  it('should have valid customer structure', () => {
    const customer = mockCustomers[0];
    expect(customer).toHaveProperty('id');
    expect(customer).toHaveProperty('companyName');
    expect(customer).toHaveProperty('tier');
    expect(customer).toHaveProperty('arr');
    expect(customer).toHaveProperty('contractRenewalDate');
    expect(customer).toHaveProperty('accountHealth');
    expect(customer).toHaveProperty('industry');
    expect(customer).toHaveProperty('employees');
    expect(customer).toHaveProperty('contactPerson');
    expect(customer).toHaveProperty('contactEmail');
  });

  it('should have valid data types', () => {
    const customer = mockCustomers[0];
    expect(typeof customer.id).toBe('string');
    expect(typeof customer.companyName).toBe('string');
    expect(typeof customer.tier).toBe('string');
    expect(typeof customer.arr).toBe('number');
    expect(typeof customer.contractRenewalDate).toBe('string');
    expect(typeof customer.accountHealth).toBe('string');
    expect(typeof customer.industry).toBe('string');
    expect(typeof customer.employees).toBe('number');
    expect(typeof customer.contactPerson).toBe('string');
    expect(typeof customer.contactEmail).toBe('string');
  });

  it('should have valid tier values', () => {
    const validTiers = ['Enterprise', 'Growth', 'Startup'];
    mockCustomers.forEach(customer => {
      expect(validTiers).toContain(customer.tier);
    });
  });

  it('should have valid account health values', () => {
    const validHealthStates = ['healthy', 'at-risk', 'expanding'];
    mockCustomers.forEach(customer => {
      expect(validHealthStates).toContain(customer.accountHealth);
    });
  });

  it('should have positive ARR values', () => {
    mockCustomers.forEach(customer => {
      expect(customer.arr).toBeGreaterThan(0);
    });
  });

  it('should have positive employee counts', () => {
    mockCustomers.forEach(customer => {
      expect(customer.employees).toBeGreaterThan(0);
    });
  });
});

describe('getCustomerById', () => {
  it('should return customer by ID', () => {
    const customer = getCustomerById('cust-001');
    expect(customer).toBeDefined();
    expect(customer.id).toBe('cust-001');
    expect(customer.companyName).toBe('Acme Corp');
  });

  it('should return undefined for non-existent ID', () => {
    const customer = getCustomerById('cust-999');
    expect(customer).toBeUndefined();
  });
});

describe('getCustomersByTier', () => {
  it('should return Enterprise customers', () => {
    const customers = getCustomersByTier('Enterprise');
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBeGreaterThan(0);
    customers.forEach(customer => {
      expect(customer.tier).toBe('Enterprise');
    });
  });

  it('should return Growth customers', () => {
    const customers = getCustomersByTier('Growth');
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBeGreaterThan(0);
    customers.forEach(customer => {
      expect(customer.tier).toBe('Growth');
    });
  });

  it('should return Startup customers', () => {
    const customers = getCustomersByTier('Startup');
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBeGreaterThan(0);
    customers.forEach(customer => {
      expect(customer.tier).toBe('Startup');
    });
  });

  it('should return empty array for invalid tier', () => {
    const customers = getCustomersByTier('InvalidTier');
    expect(customers).toEqual([]);
  });
});

describe('getAtRiskCustomers', () => {
  it('should return only at-risk customers', () => {
    const customers = getAtRiskCustomers();
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBeGreaterThan(0);
    customers.forEach(customer => {
      expect(customer.accountHealth).toBe('at-risk');
    });
  });

  it('should have at least one at-risk customer in mock data', () => {
    const customers = getAtRiskCustomers();
    expect(customers.length).toBeGreaterThan(0);
  });
});

describe('getTotalARR', () => {
  it('should calculate total ARR correctly', () => {
    const totalARR = getTotalARR();
    expect(typeof totalARR).toBe('number');
    expect(totalARR).toBeGreaterThan(0);

    // Verify calculation
    const expectedTotal = mockCustomers.reduce((total, customer) => total + customer.arr, 0);
    expect(totalARR).toBe(expectedTotal);
  });

  it('should match sum of individual customer ARRs', () => {
    const manualSum = mockCustomers.reduce((sum, c) => sum + c.arr, 0);
    expect(getTotalARR()).toBe(manualSum);
  });
});

describe('getCustomerByName', () => {
  it('should find customer by exact name', () => {
    const customer = getCustomerByName('Acme Corp');
    expect(customer).toBeDefined();
    expect(customer.companyName).toBe('Acme Corp');
  });

  it('should find customer by partial name (case-insensitive)', () => {
    const customer = getCustomerByName('acme');
    expect(customer).toBeDefined();
    expect(customer.companyName).toBe('Acme Corp');
  });

  it('should find customer by partial name (mixed case)', () => {
    const customer = getCustomerByName('ACME');
    expect(customer).toBeDefined();
    expect(customer.companyName).toBe('Acme Corp');
  });

  it('should return undefined for non-existent name', () => {
    const customer = getCustomerByName('NonExistentCompany');
    expect(customer).toBeUndefined();
  });
});
