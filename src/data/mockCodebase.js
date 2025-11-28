// Mock codebase architecture and technical components for reference
export const mockCodebase = {
  components: [
    {
      name: 'Export API',
      path: '/api/v1/exports',
      description: 'Handles data export requests in various formats (CSV, PDF, Excel)',
      language: 'Node.js',
      dependencies: ['express', 'csv-parser', 'pdfkit', 'xlsx'],
      lastModified: '2024-09-15',
      complexity: 'medium',
      performance: 'Handles up to 50 concurrent export requests',
      limitations: 'Single file exports only, no batching support'
    },
    {
      name: 'Batch Processor',
      path: '/services/batch-processor',
      description: 'Background job processing system for scheduled tasks',
      language: 'Node.js',
      dependencies: ['bull', 'redis', 'node-cron'],
      lastModified: '2024-07-20',
      complexity: 'high',
      performance: 'Processes 1000+ jobs per hour',
      limitations: 'Optimized for background jobs, not user-triggered tasks'
    },
    {
      name: 'Report Generation Service',
      path: '/services/reports',
      description: 'Generates various report types from database queries',
      language: 'Node.js',
      dependencies: ['sequelize', 'handlebars', 'chart.js'],
      lastModified: '2024-11-05',
      complexity: 'high',
      performance: 'Generates reports in 2-5 seconds average',
      limitations: 'Template-based, limited customization'
    },
    {
      name: 'Authentication Layer',
      path: '/middleware/auth',
      description: 'Handles user authentication and authorization',
      language: 'Node.js',
      dependencies: ['passport', 'jsonwebtoken', 'bcrypt'],
      lastModified: '2024-08-10',
      complexity: 'medium',
      performance: 'JWT-based, stateless authentication',
      limitations: 'No SSO integration yet'
    },
    {
      name: 'Database Layer',
      path: '/models',
      description: 'PostgreSQL database models and ORM',
      language: 'Node.js',
      dependencies: ['sequelize', 'pg'],
      lastModified: '2024-10-01',
      complexity: 'medium',
      performance: 'Supports 10,000+ concurrent connections',
      limitations: 'Some queries need optimization for large datasets'
    },
    {
      name: 'API Rate Limiter',
      path: '/middleware/rate-limit',
      description: 'Controls API request rates per user/account',
      language: 'Node.js',
      dependencies: ['express-rate-limit', 'redis'],
      lastModified: '2024-08-01',
      complexity: 'low',
      performance: 'Distributed rate limiting via Redis',
      limitations: 'Fixed tiers, no dynamic adjustment'
    },
    {
      name: 'Notification Service',
      path: '/services/notifications',
      description: 'Sends email, webhook, and in-app notifications',
      language: 'Node.js',
      dependencies: ['nodemailer', 'axios', 'socket.io'],
      lastModified: '2024-09-20',
      complexity: 'medium',
      performance: 'Async delivery, 99% delivery rate',
      limitations: 'Email only, no SMS support'
    },
    {
      name: 'Scheduler Service',
      path: '/services/scheduler',
      description: 'Cron-based task scheduling system',
      language: 'Node.js',
      dependencies: ['node-cron', 'agenda'],
      lastModified: '2024-07-15',
      complexity: 'low',
      performance: 'Runs tasks on schedule with retry logic',
      limitations: 'Server-time based, no timezone support'
    }
  ],

  pastImplementations: [
    {
      featureName: 'Scheduled Report Generation',
      implementationDate: '2024-07-15',
      complexity: 'medium',
      timeToImplement: '5 days',
      approach: 'Extended Scheduler Service with report generation hooks',
      challenges: 'Timezone handling, retry logic for failed reports',
      successMetrics: 'Reduced manual report generation by 80%'
    },
    {
      featureName: 'Webhook Notifications',
      implementationDate: '2024-09-20',
      complexity: 'low',
      timeToImplement: '3 days',
      approach: 'Added webhook delivery to existing Notification Service',
      challenges: 'Retry logic, webhook verification',
      successMetrics: '95% successful delivery rate'
    },
    {
      featureName: 'Advanced Dashboard Filtering',
      implementationDate: '2024-11-05',
      complexity: 'medium',
      timeToImplement: '4 days',
      approach: 'Built custom filter builder component with query optimization',
      challenges: 'Complex query generation, UI/UX design',
      successMetrics: 'User satisfaction score increased 40%'
    },
    {
      featureName: 'API Rate Limit Upgrade',
      implementationDate: '2024-08-01',
      complexity: 'low',
      timeToImplement: '2 days',
      approach: 'Configured tier-based limits with Redis backend',
      challenges: 'Backward compatibility, migration',
      successMetrics: 'Zero service degradation incidents'
    }
  ],

  architecturePatterns: [
    {
      pattern: 'Microservices',
      usage: 'Services are modular and independently deployable',
      benefits: 'Easy to scale individual components'
    },
    {
      pattern: 'Queue-based Processing',
      usage: 'Background jobs via Bull/Redis',
      benefits: 'Decouples long-running tasks from API requests'
    },
    {
      pattern: 'RESTful API',
      usage: 'Standard REST endpoints for client-server communication',
      benefits: 'Familiar pattern, wide tool support'
    },
    {
      pattern: 'JWT Authentication',
      usage: 'Stateless token-based auth',
      benefits: 'Scalable, no server-side session storage'
    }
  ]
};

// Helper function to get component by name
export const getComponentByName = (name) => {
  return mockCodebase.components.find(
    component => component.name.toLowerCase() === name.toLowerCase()
  );
};

// Helper function to get related components by dependency
export const getRelatedComponents = (dependencyName) => {
  return mockCodebase.components.filter(component =>
    component.dependencies.some(dep =>
      dep.toLowerCase().includes(dependencyName.toLowerCase())
    )
  );
};

// Helper function to get past implementations by complexity
export const getPastImplementationsByComplexity = (complexity) => {
  return mockCodebase.pastImplementations.filter(
    impl => impl.complexity === complexity
  );
};

// Helper function to search components
export const searchComponents = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return mockCodebase.components.filter(component =>
    component.name.toLowerCase().includes(term) ||
    component.description.toLowerCase().includes(term)
  );
};
