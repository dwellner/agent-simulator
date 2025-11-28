// Mock customer data for demo purposes
export const mockCustomers = [
  {
    id: 'cust-001',
    companyName: 'Acme Corp',
    tier: 'Enterprise',
    arr: 150000,
    contractRenewalDate: '2025-03-15',
    accountHealth: 'at-risk',
    industry: 'Manufacturing',
    employees: 500,
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sjohnson@acmecorp.com'
  },
  {
    id: 'cust-002',
    companyName: 'TechStart Inc',
    tier: 'Startup',
    arr: 12000,
    contractRenewalDate: '2025-08-22',
    accountHealth: 'healthy',
    industry: 'Technology',
    employees: 25,
    contactPerson: 'Mike Chen',
    contactEmail: 'mchen@techstart.io'
  },
  {
    id: 'cust-003',
    companyName: 'Global Solutions Ltd',
    tier: 'Enterprise',
    arr: 280000,
    contractRenewalDate: '2025-01-10',
    accountHealth: 'at-risk',
    industry: 'Consulting',
    employees: 1200,
    contactPerson: 'Emma Williams',
    contactEmail: 'ewilliams@globalsolutions.com'
  },
  {
    id: 'cust-004',
    companyName: 'DataFlow Systems',
    tier: 'Growth',
    arr: 75000,
    contractRenewalDate: '2025-06-30',
    accountHealth: 'healthy',
    industry: 'Data Analytics',
    employees: 150,
    contactPerson: 'Alex Rodriguez',
    contactEmail: 'arodriguez@dataflow.com'
  },
  {
    id: 'cust-005',
    companyName: 'CloudVista',
    tier: 'Growth',
    arr: 95000,
    contractRenewalDate: '2025-04-18',
    accountHealth: 'expanding',
    industry: 'SaaS',
    employees: 200,
    contactPerson: 'Jennifer Lee',
    contactEmail: 'jlee@cloudvista.com'
  },
  {
    id: 'cust-006',
    companyName: 'FinanceHub',
    tier: 'Enterprise',
    arr: 220000,
    contractRenewalDate: '2025-02-28',
    accountHealth: 'healthy',
    industry: 'Finance',
    employees: 800,
    contactPerson: 'Robert Taylor',
    contactEmail: 'rtaylor@financehub.com'
  },
  {
    id: 'cust-007',
    companyName: 'HealthTech Pro',
    tier: 'Growth',
    arr: 60000,
    contractRenewalDate: '2025-09-15',
    accountHealth: 'expanding',
    industry: 'Healthcare',
    employees: 120,
    contactPerson: 'Dr. Lisa Park',
    contactEmail: 'lpark@healthtechpro.com'
  },
  {
    id: 'cust-008',
    companyName: 'RetailMax',
    tier: 'Startup',
    arr: 18000,
    contractRenewalDate: '2025-07-20',
    accountHealth: 'healthy',
    industry: 'Retail',
    employees: 45,
    contactPerson: 'David Brown',
    contactEmail: 'dbrown@retailmax.com'
  }
];

// Helper function to get customer by ID
export const getCustomerById = (customerId) => {
  return mockCustomers.find(customer => customer.id === customerId);
};

// Helper function to get customers by tier
export const getCustomersByTier = (tier) => {
  return mockCustomers.filter(customer => customer.tier === tier);
};

// Helper function to get at-risk customers
export const getAtRiskCustomers = () => {
  return mockCustomers.filter(customer => customer.accountHealth === 'at-risk');
};

// Helper function to get total ARR
export const getTotalARR = () => {
  return mockCustomers.reduce((total, customer) => total + customer.arr, 0);
};
