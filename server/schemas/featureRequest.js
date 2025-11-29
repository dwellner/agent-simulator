/**
 * Feature Request Schema
 * Defines the structured format for feature requests captured by the Intake Agent
 */

export const featureRequestSchema = {
  // Customer Information
  customer: {
    companyName: '',           // Company name
    tier: '',                  // Enterprise, Growth, or Startup
    arr: 0,                    // Annual Recurring Revenue
    renewalDate: '',           // Contract renewal date
    contactPerson: '',         // Primary contact name
    contactEmail: '',          // Primary contact email
    accountHealth: ''          // healthy, at-risk, expanding
  },

  // Request Details
  request: {
    title: '',                 // Short title/summary of the request
    description: '',           // What they want (feature description)
    businessProblem: '',       // Why they need it (problem being solved)
    useCase: '',              // How they'll use it
    priority: '',             // low, medium, high, critical
    deadline: '',             // Timeline constraints or deadline
    category: ''              // Integrations, Reporting, API, Mobile, etc.
  },

  // Impact Assessment
  impact: {
    usersAffected: 0,         // Number of users affected
    revenueAtRisk: 0,         // Revenue at risk if not addressed
    competitiveThreat: '',    // Competitor mention or competitive threat
    churnRisk: ''            // none, low, medium, high
  },

  // Optional/Additional Information
  additional: {
    similarRequests: [],      // Array of similar request IDs
    currentWorkaround: '',    // Workaround they're currently using
    betaTesting: false,       // Willing to participate in beta
    customBudget: 0          // Budget for custom development
  },

  // Metadata
  meta: {
    requestDate: '',          // When request was captured
    csmName: '',             // CSM who captured the request
    completeness: 0,         // 0-100 score of how complete the info is
    status: 'draft'          // draft, pending, submitted
  }
};

/**
 * Validates a feature request object against the schema
 * @param {Object} request - The request object to validate
 * @returns {Object} - { isValid: boolean, missingFields: string[] }
 */
export function validateFeatureRequest(request) {
  const missingFields = [];

  // Required customer fields
  if (!request.customer?.companyName) missingFields.push('customer.companyName');
  if (!request.customer?.tier) missingFields.push('customer.tier');

  // Required request fields
  if (!request.request?.description) missingFields.push('request.description');
  if (!request.request?.businessProblem) missingFields.push('request.businessProblem');
  if (!request.request?.priority) missingFields.push('request.priority');

  // Required impact fields
  if (request.impact?.revenueAtRisk === undefined) missingFields.push('impact.revenueAtRisk');
  if (!request.impact?.churnRisk) missingFields.push('impact.churnRisk');

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Calculates completeness score (0-100) based on filled fields
 * @param {Object} request - The request object
 * @returns {number} - Completeness percentage
 */
export function calculateCompleteness(request) {
  let filledFields = 0;
  let totalFields = 0;

  // Count customer fields (6 fields)
  const customerFields = ['companyName', 'tier', 'arr', 'renewalDate', 'contactPerson', 'accountHealth'];
  customerFields.forEach(field => {
    totalFields++;
    if (request.customer?.[field]) filledFields++;
  });

  // Count request fields (7 fields)
  const requestFields = ['title', 'description', 'businessProblem', 'useCase', 'priority', 'deadline', 'category'];
  requestFields.forEach(field => {
    totalFields++;
    if (request.request?.[field]) filledFields++;
  });

  // Count impact fields (4 fields)
  const impactFields = ['usersAffected', 'revenueAtRisk', 'competitiveThreat', 'churnRisk'];
  impactFields.forEach(field => {
    totalFields++;
    if (request.impact?.[field] !== undefined && request.impact?.[field] !== '') filledFields++;
  });

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Creates an empty feature request with default values
 * @returns {Object} - Empty feature request object
 */
export function createEmptyRequest() {
  return {
    customer: {
      companyName: '',
      tier: '',
      arr: 0,
      renewalDate: '',
      contactPerson: '',
      contactEmail: '',
      accountHealth: ''
    },
    request: {
      title: '',
      description: '',
      businessProblem: '',
      useCase: '',
      priority: '',
      deadline: '',
      category: ''
    },
    impact: {
      usersAffected: 0,
      revenueAtRisk: 0,
      competitiveThreat: '',
      churnRisk: ''
    },
    additional: {
      similarRequests: [],
      currentWorkaround: '',
      betaTesting: false,
      customBudget: 0
    },
    meta: {
      requestDate: new Date().toISOString(),
      csmName: '',
      completeness: 0,
      status: 'draft'
    }
  };
}

export default {
  featureRequestSchema,
  validateFeatureRequest,
  calculateCompleteness,
  createEmptyRequest
};
