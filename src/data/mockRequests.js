// Mock historical feature requests for pattern matching and context
export const mockRequests = [
  {
    id: 'req-001',
    customerId: 'cust-001',
    customerSegment: 'Enterprise',
    requestDate: '2024-09-15',
    description: 'Bulk export functionality for reports',
    category: 'Export',
    status: 'pending',
    priority: 'high',
    revenueAtRisk: 150000,
    urgency: 'Contract renewal in 60 days',
    competitorMention: 'Competitor X offers this feature',
    estimatedVolume: '200+ reports per month',
    businessImpact: 'Critical for workflow efficiency'
  },
  {
    id: 'req-002',
    customerId: 'cust-003',
    customerSegment: 'Enterprise',
    requestDate: '2024-10-22',
    description: 'SSO integration with Okta',
    category: 'Authentication',
    status: 'in-progress',
    priority: 'high',
    revenueAtRisk: 100000,
    urgency: 'Blocking expansion deal',
    competitorMention: null,
    estimatedVolume: '1200 users',
    businessImpact: 'Required for enterprise security compliance'
  },
  {
    id: 'req-003',
    customerId: 'cust-005',
    customerSegment: 'Growth',
    requestDate: '2024-08-10',
    description: 'Advanced filtering in dashboard',
    category: 'UI Enhancement',
    status: 'completed',
    priority: 'medium',
    revenueAtRisk: 0,
    urgency: 'Quality of life improvement',
    competitorMention: null,
    estimatedVolume: 'All users',
    businessImpact: 'Improves user productivity',
    implementationDate: '2024-11-05',
    resolutionNotes: 'Implemented with custom filter builder'
  },
  {
    id: 'req-004',
    customerId: 'cust-004',
    customerSegment: 'Growth',
    requestDate: '2024-07-18',
    description: 'API rate limit increase',
    category: 'API',
    status: 'completed',
    priority: 'high',
    revenueAtRisk: 75000,
    urgency: 'Service degradation occurring',
    competitorMention: null,
    estimatedVolume: '10,000 requests/hour needed',
    businessImpact: 'Preventing service disruption',
    implementationDate: '2024-08-01',
    resolutionNotes: 'Upgraded tier with custom rate limits'
  },
  {
    id: 'req-005',
    customerId: 'cust-006',
    customerSegment: 'Enterprise',
    requestDate: '2024-09-25',
    description: 'Custom branding options',
    category: 'Customization',
    status: 'pending',
    priority: 'medium',
    revenueAtRisk: 0,
    urgency: 'Nice to have for Q1',
    competitorMention: null,
    estimatedVolume: 'White-label interface',
    businessImpact: 'Brand consistency for client-facing reports'
  },
  {
    id: 'req-006',
    customerId: 'cust-002',
    customerSegment: 'Startup',
    requestDate: '2024-06-12',
    description: 'Webhook notifications for events',
    category: 'Integration',
    status: 'completed',
    priority: 'medium',
    revenueAtRisk: 0,
    urgency: 'Automation requirement',
    competitorMention: null,
    estimatedVolume: '100 events/day',
    businessImpact: 'Enable workflow automation',
    implementationDate: '2024-09-20',
    resolutionNotes: 'Built event notification system with webhook support'
  },
  {
    id: 'req-007',
    customerId: 'cust-007',
    customerSegment: 'Growth',
    requestDate: '2024-10-05',
    description: 'HIPAA compliance features',
    category: 'Compliance',
    status: 'in-progress',
    priority: 'critical',
    revenueAtRisk: 60000,
    urgency: 'Required for healthcare clients',
    competitorMention: null,
    estimatedVolume: 'All healthcare segment',
    businessImpact: 'Market expansion requirement'
  },
  {
    id: 'req-008',
    customerId: 'cust-001',
    customerSegment: 'Enterprise',
    requestDate: '2024-05-20',
    description: 'Scheduled report generation',
    category: 'Export',
    status: 'completed',
    priority: 'high',
    revenueAtRisk: 0,
    urgency: 'Operational efficiency',
    competitorMention: null,
    estimatedVolume: 'Daily/weekly schedules',
    businessImpact: 'Reduces manual work',
    implementationDate: '2024-07-15',
    resolutionNotes: 'Built scheduler with cron-based triggers'
  },
  {
    id: 'req-009',
    customerId: 'cust-005',
    customerSegment: 'Growth',
    requestDate: '2024-11-01',
    description: 'Multi-language support',
    category: 'Localization',
    status: 'pending',
    priority: 'low',
    revenueAtRisk: 0,
    urgency: 'Future expansion',
    competitorMention: null,
    estimatedVolume: 'Spanish, French, German',
    businessImpact: 'International market expansion'
  },
  {
    id: 'req-010',
    customerId: 'cust-008',
    customerSegment: 'Startup',
    requestDate: '2024-09-30',
    description: 'Mobile app development',
    category: 'Platform',
    status: 'pending',
    priority: 'low',
    revenueAtRisk: 0,
    urgency: 'Long-term strategic',
    competitorMention: 'Competitors have mobile apps',
    estimatedVolume: 'iOS and Android',
    businessImpact: 'Mobile-first user access'
  }
];

// Helper function to get requests by category
export const getRequestsByCategory = (category) => {
  return mockRequests.filter(request => request.category === category);
};

// Helper function to get requests by status
export const getRequestsByStatus = (status) => {
  return mockRequests.filter(request => request.status === status);
};

// Helper function to get high priority requests
export const getHighPriorityRequests = () => {
  return mockRequests.filter(request =>
    request.priority === 'high' || request.priority === 'critical'
  );
};

// Helper function to get similar requests (by category)
export const getSimilarRequests = (category) => {
  return mockRequests.filter(request => request.category === category);
};

// Helper function to calculate total revenue at risk
export const getTotalRevenueAtRisk = () => {
  return mockRequests
    .filter(request => request.status === 'pending')
    .reduce((total, request) => total + request.revenueAtRisk, 0);
};

// Helper function to get requests by category
export const getRequestsByCategory = (category) => {
  return mockRequests.filter(request => request.category === category);
};
