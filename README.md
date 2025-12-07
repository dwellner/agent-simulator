# AI-Enhanced Product Workflow Demo

> An interactive demonstration of how AI agents transform product development workflows through intelligent coordination and autonomous task execution.

[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet%203.5-764abc)](https://www.anthropic.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Overview

This application demonstrates a **paradigm shift** in how product development workflows can be enhanced with AI agents. Rather than simply making individuals more productive, AI agents fundamentally restructure workflows by:

- **Capturing and structuring** unstructured customer feedback
- **Synthesizing insights** across multiple customer requests
- **Automatically coordinating** between teams (Product → Engineering)
- **Generating technical specifications** from business requirements

### The Workflow

The demo simulates a realistic feature request flow with three AI agents assisting three key roles:

1. **Request Intake Agent** (CSM) - Structures customer requests and extracts business context
2. **Customer Insights Agent** (PM) - Analyzes patterns across insights and automatically triggers technical analysis
3. **Technical Specification Agent** (Engineering) - Evaluates feasibility and generates implementation specifications

### Key Innovation: Agent-to-Agent Communication

When the Product Manager asks about technical feasibility, the **Customer Insights Agent automatically triggers the Technical Specification Agent** to perform autonomous analysis. This demonstrates how AI agents can coordinate without human intervention, fundamentally changing the workflow structure.

---

## Features

✅ **Three AI-Powered Agents** - Each specialized for a specific role
✅ **Parallel Workflow Model** - All three roles can work simultaneously
✅ **Session-Based State** - Data persists across page refreshes (2-hour TTL)
✅ **Agent-to-Agent Triggers** - PM can automatically initiate Engineering analysis
✅ **Real-Time Activity Feed** - Tracks all agent work across the system
✅ **Structured Data Exchange** - Well-defined schemas for insights and specifications

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic Claude API key ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/agent-simulator.git
cd agent-simulator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your CLAUDE_API_KEY
```

### Running the Application

```bash
# Start both frontend and backend
npm run dev

# Frontend will be available at: http://localhost:5173
# Backend API will run on: http://localhost:3001
```

### Testing the Workflow

1. **CSM Window**: Submit a customer request
   ```
   Our customer Acme Corp (Enterprise, $50K ARR) is requesting a bulk export
   feature. They need to export 200+ reports simultaneously in CSV format.
   Their renewal is coming up in 60 days and they mentioned that competitors
   already offer this capability.
   ```

2. **CSM Window**: Click "Submit Insight" to send to PM

3. **PM Window**: Ask about patterns
   ```
   What patterns do you see in the insights?
   ```

4. **PM Window**: Request technical analysis
   ```
   Can you analyze the technical feasibility of the bulk export feature?
   ```

5. **PM Window**: Click "Share with Engineering"

6. **Engineering Window**: Review the technical specification and discuss implementation

---

## Documentation

### 📋 [Project Specification](doc/project-spec.md)
**What:** High-level vision and goals
**Covers:** Purpose, target audience, workflow explanation, success criteria, and user experience design

### 🔧 [Technical Design](doc/technical-design.md)
**What:** Complete technical architecture and implementation details
**Covers:**
- System architecture diagrams
- AI agent descriptions and processing flows
- Human-to-agent and agent-to-agent communication flows
- Data models and session management
- Security and performance considerations
- Mermaid diagrams for all key workflows

### 📝 [Development Plan](doc/plan.md)
**What:** Phased implementation roadmap
**Covers:**
- Phase-by-phase development breakdown
- Completed features with implementation notes
- Remaining tasks and validation criteria
- Progress tracking and status updates

### 🛠️ [Development Workflow](doc/development-workflow.md)
**What:** Coding standards and best practices
**Covers:**
- Git workflow and commit conventions
- Code review process
- Testing strategy
- Documentation requirements

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────┐    ┌──────────┐    ┌─────────────┐           │
│  │   CSM    │    │    PM    │    │ Engineering │           │
│  │  Window  │    │  Window  │    │   Window    │           │
│  └──────────┘    └──────────┘    └─────────────┘           │
│                                                              │
│              ┌────────────────────────┐                     │
│              │   Activity Feed        │                     │
│              └────────────────────────┘                     │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP + Session Cookies
┌──────────────────────┴───────────────────────────────────────┐
│                    Backend (Express)                         │
│  ┌────────────┐  ┌───────────────┐  ┌──────────────┐       │
│  │  Request   │  │   Customer    │  │  Technical   │       │
│  │  Intake    │  │   Insights    │  │Specification │       │
│  │   Agent    │  │    Agent      │  │    Agent     │       │
│  └────────────┘  └───────┬───────┘  └──────────────┘       │
│                          │                                   │
│                          │ [TRIGGER_TECH_ANALYSIS]          │
│                          └──────────────────►                │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │        Session Store (Insights + Tech Specs)       │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────┬───────────────────────────────────────┘
                       │
              ┌────────┴────────┐
              │  Claude API     │
              │  (Anthropic)    │
              └─────────────────┘
```

### Technology Stack

- **Frontend**: React 18, Vite, Custom Hooks for state management
- **Backend**: Node.js, Express, express-session
- **AI**: Anthropic Claude API (Sonnet 3.5)
- **Testing**: Vitest with 71 unit tests
- **Data Flow**: RESTful APIs with session-based persistence

---

## Project Status

### ✅ Completed Features (Phases 1-9)

- **Phase 1-4**: Foundation and core infrastructure
  - Project setup and architecture
  - Frontend layout with three role windows
  - Activity feed and workflow timeline
  - Session management
- **Phase 5-6**: Request Intake Agent (CSM assistance)
  - Structured customer request capture
  - Context extraction and validation
  - Insights repository
- **Phase 7**: Technical Specification Agent (Engineering assistance)
  - Autonomous and conversational modes
  - Codebase-aware analysis
  - Multiple implementation approaches
- **Phase 8**: PM-Engineering integration with agent-to-agent communication
  - Customer Insights Agent (PM assistance)
  - Automatic tech analysis triggering
  - Share technical specs with Engineering
- **Phase 9**: Agent-to-agent communication infrastructure
  - Session-based coordination between agents
  - Context package creation and passing
  - Activity feed integration for agent work
  - Real-time updates during autonomous analysis

### ✅ Recently Completed

- **Phase 10**: Demo flow polish
  - Reset functionality with backend session clearing
  - Retry logic with exponential backoff (2 retries, 5xx errors only)
  - User-friendly error messages for all error types
  - Compact UI redesign with reduced vertical space usage
- **Phase 11.1**: Unit testing framework
  - Vitest 4.0.15 with 71 passing tests (100% pass rate)
  - Mock data validation and helper function tests
  - API utilities testing (retry logic, error handling)

### 🚧 In Progress

- **Phase 11.2-11.4**: Integration and end-to-end testing
- **Phase 12**: Deployment preparation

### 📅 Deferred (Post-Deployment)

- **Phase 13**: Real-time updates with Server-Sent Events (advanced enhancement)

See [doc/plan.md](doc/plan.md) for detailed progress tracking.

---

## Key Concepts

### Agent-to-Agent Communication

The system uses a special marker pattern for inter-agent communication:

```javascript
// Insights Agent Response
`Based on customer insights, initiating technical analysis...

[TRIGGER_TECH_ANALYSIS]
{
  "title": "Bulk CSV Export",
  "description": "Export 200+ reports simultaneously...",
  "businessContext": "Enterprise customer, $50K ARR, renewal in 60 days",
  "technicalRequirements": "Async processing, CSV format, notifications"
}
`
```

The backend detects this marker, extracts the JSON, and automatically triggers the Technical Specification Agent.

### Session-Based State

All data is stored per-session:
- Customer insights submitted by CSM
- Technical specifications generated by Engineering
- 2-hour TTL with automatic cleanup
- Survives page refreshes

### Structured Data Flow

```
Customer Request (Text)
  ↓ [Request Intake Agent]
Structured Insight (JSON)
  ↓ [Submit to PM]
Insights Repository
  ↓ [Customer Insights Agent]
Feature Requirements (JSON)
  ↓ [Auto-trigger Tech Agent]
Technical Specification
  ↓ [Share with Engineering]
Engineering Review
```

---

## Development

### Running Tests

```bash
# Unit tests (Vitest)
npm test                    # Run all tests once
npm run test:watch         # Run tests in watch mode
npm run test:ui            # Run tests with UI

# Integration tests (Backend - requires server running)
node server/tests/integration/csm.test.js  # Test CSM conversation flow (25+ assertions)
node server/tests/integration/pm.test.js   # Test PM query flow with Tech Agent triggering (15+ assertions)
node server/tests/integration/e2e.test.js  # Test complete CSM → PM → Engineering workflow (20+ assertions)

# Component tests (Backend)
node server/tests/component/pm-tech-trigger.test.js  # Test PM → Tech Agent trigger
node server/tests/component/tech-agent.test.js       # Test Tech Spec Agent modes
```

### Environment Variables

See [`.env.example`](.env.example) for a complete list with detailed descriptions.

Required variables:
```bash
CLAUDE_API_KEY=sk-ant-...              # Anthropic API key (get from console.anthropic.com)
SESSION_SECRET=your-secret-key         # Session signing secret (generate: openssl rand -base64 32)
```

Optional configuration:
```bash
NODE_ENV=development                   # Environment (development|production)
PORT=3001                              # Backend port
ALLOWED_ORIGINS=http://localhost:5173  # CORS allowed origins (comma-separated)
LOG_LEVEL=info                         # Logging level (error|warn|info|debug)
ENABLE_ERROR_STACK=true                # Include stack traces in errors
```

### File Structure

```
agent-simulator/
├── doc/                    # Documentation
│   ├── project-spec.md     # Project vision and goals
│   ├── technical-design.md # Architecture and design
│   ├── plan.md            # Development roadmap
│   └── development-workflow.md
├── server/                 # Backend
│   ├── agents/            # AI agent implementations
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── data/              # Mock data
│   └── tests/             # Backend tests
│       ├── integration/   # Integration tests
│       └── component/     # Component tests
├── src/                   # Frontend
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── data/              # Mock data + tests
│   ├── utils/             # Utility functions + tests
│   └── App.jsx
├── vitest.config.js       # Vitest configuration
└── package.json
```

### Mock Data Structure

The application uses mock data to simulate realistic scenarios without requiring a database. Mock data is defined in `src/data/`:

#### `mockCustomers.js`
Simulates customer accounts with business context:
```javascript
{
  id: 'cust-001',
  companyName: 'Acme Corp',
  tier: 'Enterprise',              // Enterprise, Growth, or Startup
  arr: 150000,                     // Annual Recurring Revenue
  contractRenewalDate: '2025-03-15',
  accountHealth: 'at-risk',        // at-risk, healthy, or expanding
  industry: 'Manufacturing',
  employees: 500,
  contactPerson: 'Sarah Johnson',
  contactEmail: 'sjohnson@acmecorp.com'
}
```

Available helper functions:
- `getCustomerById(id)` - Find customer by ID
- `getCustomersByTier(tier)` - Filter by tier
- `getAtRiskCustomers()` - Get at-risk customers
- `getCustomerByName(name)` - Search by company name

#### `mockRequests.js`
Historical feature requests for pattern matching:
```javascript
{
  id: 'req-001',
  customerId: 'cust-001',
  customerSegment: 'Enterprise',
  requestDate: '2024-09-15',
  description: 'Bulk export functionality for reports',
  category: 'Export',              // Export, API, Authentication, etc.
  status: 'pending',               // pending, in-progress, or completed
  priority: 'high',                // critical, high, medium, or low
  revenueAtRisk: 150000,
  urgency: 'Contract renewal in 60 days',
  competitorMention: 'Competitor X offers this feature',
  estimatedVolume: '200+ reports per month',
  businessImpact: 'Critical for workflow efficiency'
}
```

Available helper functions:
- `getRequestsByCategory(category)` - Filter by category
- `getRequestsByStatus(status)` - Filter by status
- `getHighPriorityRequests()` - Get high/critical priority requests
- `getSimilarRequests(category)` - Find similar requests
- `getTotalRevenueAtRisk()` - Calculate total revenue at risk

#### `mockCodebase.js`
Simulates existing technical components for feasibility analysis:
```javascript
{
  components: [
    {
      name: 'Export API',
      path: '/api/v1/exports',
      description: 'Handles data export requests in various formats',
      language: 'Node.js',
      dependencies: ['express', 'csv-parser', 'pdfkit', 'xlsx'],
      lastModified: '2024-09-15',
      complexity: 'medium',         // low, medium, or high
      performance: 'Handles up to 50 concurrent export requests',
      limitations: 'Single file exports only, no batching support'
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
    }
  ],
  architecturePatterns: [
    {
      pattern: 'Microservices',
      usage: 'Services are modular and independently deployable',
      benefits: 'Easy to scale individual components'
    }
  ]
}
```

Available helper functions:
- `getComponentByName(name)` - Find component by name
- `getRelatedComponents(dependency)` - Find components using a dependency
- `getPastImplementationsByComplexity(complexity)` - Filter past implementations
- `searchComponents(searchTerm)` - Search components by name/description

---

## Troubleshooting

### Server Won't Start

**Error**: `ENVIRONMENT VALIDATION FAILED`
```
❌ Missing required environment variable: CLAUDE_API_KEY
```

**Solution**: Ensure you have created a `.env` file with your Claude API key:
```bash
cp .env.example .env
# Edit .env and add your CLAUDE_API_KEY
```

Get an API key from [Anthropic Console](https://console.anthropic.com/).

---

**Error**: `Port 3001 already in use`

**Solution**: Kill the process using the port or change the port:
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9

# Or change the port in .env
PORT=3002
```

---

### Frontend Issues

**Error**: Frontend shows "Failed to fetch" or "Network Error"

**Solution**:
1. Verify the backend server is running on port 3001
2. Check CORS configuration in `.env`:
   ```bash
   ALLOWED_ORIGINS=http://localhost:5173
   ```
3. Clear browser cache and cookies (session cookie might be stale)

---

**Error**: Page refreshes lose all data

**Solution**: This is expected behavior. The application uses:
- **Session-based state** (2-hour TTL) - persists across page refreshes
- **In-memory React state** - resets on page refresh

To preserve data across refreshes, ensure:
1. Insights are submitted to PM via "Submit Insight" button
2. Tech specs are shared to Engineering via "Share with Engineering" button

---

### AI Agent Issues

**Error**: "Anthropic API error: 429 Rate Limit Exceeded"

**Solution**: You've hit the API rate limit. Wait a few seconds and try again. The application includes automatic retry logic with exponential backoff (2 retries for 5xx errors).

---

**Error**: "Anthropic API error: 401 Unauthorized"

**Solution**: Your API key is invalid or expired:
1. Verify your API key in `.env`
2. Get a new key from [Anthropic Console](https://console.anthropic.com/)
3. Restart the server after updating `.env`

---

**Error**: Agent responses are incomplete or cut off

**Solution**: This is usually due to token limits. The application uses Claude Sonnet 3.5 with a 200K token context window, which should handle most workflows. If you encounter this:
1. Try with shorter messages
2. Reset the workflow and start fresh
3. Check the server logs for detailed error messages

---

### Testing Issues

**Error**: Integration tests fail with "Connection refused"

**Solution**: Integration tests require the server to be running:
```bash
# Terminal 1: Start the server
npm run dev

# Terminal 2: Run tests
node server/tests/integration/csm.test.js
```

---

**Error**: Unit tests fail with "Cannot find module"

**Solution**: Ensure dependencies are installed:
```bash
npm install
npm test
```

---

### Production Build Issues

**Error**: Production build shows blank page

**Solution**:
1. Verify the build completed successfully:
   ```bash
   npm run build
   ```
2. Check that `dist/` directory exists with built files
3. Ensure `NODE_ENV=production` when running `npm start`
4. Check browser console for JavaScript errors

---

**Error**: API calls fail in production with 404

**Solution**: The production server serves both frontend and API. Ensure:
1. API routes are correctly prefixed with `/api`
2. Backend is running on the same origin in production
3. CORS is configured for production domain if using separate deployments

---

### Session Issues

**Error**: "Session expired" or session data disappears

**Solution**: Sessions have a 2-hour TTL. Either:
1. Continue working within the 2-hour window
2. Use the Reset button to start a fresh session
3. Check that `SESSION_SECRET` is set in `.env` (required for session signing)

---

**Error**: Multiple browser tabs show different data

**Solution**: Each browser session has its own data. To share data between tabs:
1. Use the same browser session (same session cookie)
2. Or reset and start fresh in one tab

---

### Still Having Issues?

1. Check server logs for detailed error messages
2. Set `LOG_LEVEL=debug` in `.env` for verbose logging
3. Review the [Technical Design](doc/technical-design.md) for architecture details
4. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Server logs (set `LOG_LEVEL=debug`)

---

## Contributing

This is a demonstration project showing AI-enhanced workflows. Contributions are welcome!

### Development Workflow

1. Read [doc/development-workflow.md](doc/development-workflow.md)
2. Create a feature branch
3. Follow the coding standards
4. Write tests for new features
5. Submit a pull request

---

## License

MIT License - See [LICENSE](LICENSE) file for details

---

## Acknowledgments

Built with [Claude](https://www.anthropic.com/) - An AI assistant by Anthropic

---

## Learn More

- [Anthropic Claude API Documentation](https://docs.anthropic.com/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)

---

**Questions?** Open an issue or check the [documentation](doc/)
