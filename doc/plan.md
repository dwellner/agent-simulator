# AI-Enhanced Product Workflow Demo - Development Plan

This plan breaks down the development into small, incremental steps that can be built, tested, and validated independently.

---

## Phase 1: Project Foundation

### Step 1.1: Initialize Project Structure ✓
- [x] Create React application with Vite
- [x] Set up basic folder structure (src/components, src/services, src/data, src/hooks)
- [x] Create server folder structure (server/routes, server/agents, server/services)
- [x] Initialize package.json with dependencies
- [x] Create .env.example file with required environment variables

**Dependencies:** react, react-dom, vite, express, cors, dotenv

**Validation:** `npm run dev` starts development server successfully ✓

### Step 1.2: Environment Configuration ✓
- [x] Set up .env file structure
- [x] Add Claude API key configuration
- [x] Configure server port and CORS settings
- [x] Add environment variable validation on startup

**Validation:** Server starts and validates environment variables ✓

### Step 1.3: Create Mock Data ✓
- [x] Create `src/data/mockCustomers.js` (5-10 mock customers with ARR, tier, renewal dates)
- [x] Create `src/data/mockRequests.js` (5-10 historical feature requests)
- [x] Create `src/data/mockCodebase.js` (technical components for reference)
- [x] Export all mock data with proper structure

**Validation:** Import mock data in test file and verify structure ✓

---

## Architecture Decisions

### Workflow Model
The application uses a **parallel/flexible workflow model** where all three roles (CSM, PM, Engineering Lead) can be active and used simultaneously. This better demonstrates how AI agents work in parallel and supports a pull-based workflow where users can interact with any conversation at any time, in any order.

### Agent Context Management
Each agent (Request Intake, Customer Insights, Technical Specification) maintains **separate Claude conversation contexts**. Information flows between agents via structured data passing:
- CSM → Structured Request → **Customer Insights Repository**
- PM → Feature Requirements → Tech Agent (via system message)
- Tech Agent → Technical Spec → Engineering Lead

### Insights Repository vs Queue
The **Customer Insights Repository** is not a mechanical queue to be processed. Instead, it's a **conversational knowledge base** that the PM explores through natural language queries. The PM asks analytical questions (e.g., "What patterns do you see?", "Which Enterprise customers need export features?") to discover patterns, synthesize across insights, and make informed product decisions.

### State & Session Management
- **Session-based isolation**: Each user gets their own demo session (2-hour expiry)
- **In-memory insights repository**: Customer insights stored in-memory per session
- **No database required**: Ephemeral state acceptable for demo
- **Cloud-ready architecture**: Abstract insights service allows easy upgrade to database later

### Deployment Platform
**Fly.io** (Free tier):
- No cold starts, always-running
- 3 shared VMs, 160GB transfer, 3GB storage
- Simple deployment with `fly deploy`
- Free PostgreSQL available if needed later
- Cost: $0/month for expected usage

---

## Phase 2: Basic UI Layout

### Step 2.1: Main Layout Component ✓
- [x] Create `src/components/Layout.jsx` with basic grid structure
- [x] Implement responsive layout (horizontal split for 3 role windows)
- [x] Add header with app title
- [x] Add footer with reset button (non-functional initially)

**Validation:** Layout renders correctly with placeholder content ✓

### Step 2.2: Role Window Component ✓
- [x] Create `src/components/RoleWindow.jsx`
- [x] Implement props: title, isActive, messages, onSendMessage
- [x] Add visual indicator for active/inactive state
- [x] Style readonly vs active input field
- [x] Add basic message display (chat bubbles)

**Validation:** Render 3 RoleWindow components with different active states ✓

### Step 2.3: Workflow Timeline Component ✓
- [x] Create `src/components/WorkflowTimeline.jsx`
- [x] Show conversation activity status for each role (has messages, agent working, etc.)
- [x] Add elapsed time display (total demo time)
- [x] Make timeline responsive
- [x] Update to show parallel work vs sequential stages

**Validation:** Timeline shows activity status for all roles simultaneously ✓

### Step 2.4: Agent Activity Feed Component ✓
- [x] Create `src/components/AgentActivityFeed.jsx`
- [x] Implement scrollable activity log
- [x] Style different activity types (in-progress ⚡, completed ✓)
- [x] Add auto-scroll to latest activity
- [x] Add clear visual hierarchy

**Validation:** Feed displays mock activity entries with proper styling ✓

---

## Phase 3: State Management

**Note:** In the parallel workflow model, all state is managed simultaneously. We refactor existing state from Layout.jsx into a custom hook for better organization and reusability.

### Step 3.1: Workflow State Hook ✓
- [x] Create `src/hooks/useWorkflowState.js`
- [x] Extract conversation history arrays from Layout.jsx (csmMessages, pmMessages, engMessages)
- [x] Extract activity log state and addActivity function
- [x] Extract elapsed time tracking
- [x] Implement reset functionality (clear all conversations, activities, and reset timer)
- [x] Export message handlers (handleCsmMessage, handlePmMessage, handleEngMessage)

**Validation:** Hook manages all parallel conversation state correctly ✓

### Step 3.2: Integrate State Hook into Layout ✓
- [x] Import useWorkflowState hook in Layout.jsx
- [x] Replace local state with hook state
- [x] Verify all three roles remain active simultaneously
- [x] Test message handling and activity tracking
- [x] Ensure elapsed timer continues to work

**Validation:** Layout component works identically but with cleaner state management ✓

### Step 3.3: Reset Functionality ✓
- [x] Implement resetWorkflow function in useWorkflowState hook
- [x] Clear all conversation arrays
- [x] Clear activity log
- [x] Reset start time to current time
- [x] Connect reset button in Layout.jsx to resetWorkflow
- [x] Enable reset button (currently disabled)

**Validation:** Reset button clears all state and restarts demo ✓

---

## Phase 4: Backend Setup

### Step 4.1: Basic Express Server ✓
- [x] Create `server/server.js` with Express setup
- [x] Configure CORS for React frontend
- [x] Add health check endpoint
- [x] Set up error handling middleware
- [x] Configure port from environment variables

**Validation:** Server runs and responds to health check ✓

### Step 4.2: Claude API Service ✓
- [x] Create `server/services/claudeApi.js`
- [x] Implement Claude API client initialization
- [x] Add function to send messages to Claude
- [x] Add streaming support for responses
- [x] Implement error handling and retries

**Validation:** Successfully send test message to Claude API ✓

### Step 4.3: Agent Routes ✓
- [x] Create `server/routes/agents.js`
- [x] Add POST endpoint for intake agent conversation
- [x] Add POST endpoint for queue agent conversation
- [x] Add POST endpoint for tech spec agent conversation
- [x] Add request validation

**Validation:** All endpoints respond with proper status codes ✓

---

## Phase 5: Request Intake Agent (CSM Stage)

### Step 5.1: Intake Agent Prompt Engineering ✓
- [x] Create `server/agents/intakeAgent.js`
- [x] Write system prompt for Request Intake Agent
- [x] Define agent personality (proactive interviewer)
- [x] Specify required information to extract
- [x] Add mock data access instructions

**Validation:** Test prompt with sample input, verify agent asks clarifying questions ✓

### Step 5.2: Intake Agent Context Integration ✓
- [x] Integrate customer database access into agent context
- [x] Add historical requests to agent context
- [x] Implement search for similar past requests
- [x] Format context data for Claude API

**Validation:** Agent references customer data in responses ✓

### Step 5.3: Intake Agent Structured Output ✓
- [x] Define structured request format (JSON schema)
- [x] Implement extraction of structured data from conversation
- [x] Store structured request in state
- [x] Generate summary for CSM approval

**Validation:** Agent produces valid structured request data ✓

### Step 5.4: CSM Conversation UI Integration ✓
- [x] Connect CSM RoleWindow to intake agent endpoint
- [x] Implement message sending from UI
- [x] Display agent responses in chat
- [x] Add loading state during API calls
- [x] Handle errors gracefully

**Validation:** Full conversation flow works between CSM and intake agent ✓

### Step 5.5: Submit Customer Insights ✓
- [x] Add "Submit Insight" button to CSM window
- [x] Enable button only when request is structured and complete
- [x] Implement action to submit structured request as customer insight (client-side only)
- [x] Show confirmation message in CSM window
- [x] Update activity feed with insight submission

**Validation:** CSM can successfully submit customer insights to PM ✓

**Note:** Currently insights stored client-side only. Step 5.6 adds backend storage.

### Step 5.6: Backend Insights Repository & Session Management ✓
- [x] Create `server/services/insightsService.js` with abstraction layer
- [x] Implement session-based insights storage (in-memory Map with session IDs)
- [x] Add session middleware (`express-session`) for user isolation
- [x] Create POST `/api/insights/submit` endpoint to accept insights from CSM
- [x] Create GET `/api/insights` endpoint to retrieve insights for a session
- [x] Implement session cleanup for expired sessions (2-hour TTL)
- [x] Update frontend `submitInsight()` to POST to backend endpoint
- [x] Add session ID handling in frontend (cookies)

**Validation:** Multiple browser sessions can submit and retrieve their own isolated insights ✓

---

## Phase 6: Customer Insights Agent (PM Stage)

### Step 6.1: Insights Agent Prompt Engineering ✓
- [x] Create `server/agents/insightsAgent.js`
- [x] Write system prompt for Customer Insights Agent
- [x] Define analytical and synthesis personality
- [x] Specify conversational query capabilities
- [x] Add insights repository access instructions

**Validation:** Test prompt with sample queries, verify synthesis behavior ✓

**Note:** Steps 6.2 and 6.3 were completed together with 6.1 as they're tightly coupled.

### Step 6.2: Insights Agent Integration with Repository ✓
- [x] Integrate insightsService into insights agent
- [x] Pass session ID to retrieve correct insights
- [x] Format insights data for agent context
- [x] Implement insight query functions (filter, group, aggregate)
- [x] Add pattern matching across insights
- [x] Add aggregation functions (total ARR, customer count)
- [x] Implement grouping by criteria (urgency, category, customer tier)

**Validation:** Agent has access to session's insights and can analyze them ✓

### Step 6.3: PM Conversation UI Integration ✓
- [x] Update PM handler to call `/api/agents/insights` endpoint
- [x] Ensure session ID is passed with requests
- [x] Display agent responses with formatted data
- [x] Add loading state during API calls
- [x] Test full PM workflow with real insights data

**Validation:** PM can query insights successfully and get relevant analysis ✓

---

## Phase 7: Technical Specification Agent (Engineering Stage)

**Note:** Phase 7 moved here (before old 6.4-6.5) because we need to build the Tech Agent before we can implement triggering/coordination.

### Step 7.1: Tech Spec Agent Prompt Engineering ✓
- [x] Create `server/agents/techSpecAgent.js`
- [x] Write system prompt for Technical Specification Agent
- [x] Define technical analyst personality (both autonomous and conversational modes)
- [x] Specify autonomous analysis capabilities
- [x] Add codebase reference instructions (mockCodebase.js integration)

**Validation:** Test prompt with sample feature, verify technical depth ✓

**Implementation Notes:**
- Created comprehensive system prompts for both autonomous and conversational modes
- Integrated full mockCodebase context (8 components, 4 past implementations, architecture patterns)
- Agent provides 2-3 implementation approaches with specific component references
- All tests passed with excellent technical depth and precision

### Step 7.2-7.5: Complete Tech Spec Agent Implementation ✓
- [x] Implement autonomous analysis mode (`performAutonomousAnalysis`)
- [x] Implement conversational refinement mode
- [x] Create POST `/api/agents/techspec` endpoint (conversational)
- [x] Create POST `/api/agents/techspec/autonomous` endpoint (autonomous trigger)
- [x] Create GET `/api/agents/techspec/list` endpoint (retrieve session specs)
- [x] Store tech specs in session for persistence
- [x] Update Engineering handler in `useWorkflowState.js` to call API
- [x] Add loading states and error handling
- [x] Format codebase context for agent access

**Validation:** All endpoints functional, Engineering Lead can converse with Tech Spec Agent ✓

**Implementation Notes:**
- Combined steps 7.2-7.5 as they are tightly coupled
- Session-based storage for tech specs (accessible across page refreshes within session)
- Both modes fully functional: autonomous (PM-triggered) and conversational (Engineering-driven)
- Activity feed integration complete
- Test suite created and passing (`server/test-tech-agent.js`)

---

## Phase 8: PM-to-Engineering Workflow Integration

### Step 8.1: Tech Agent Triggering from PM ✓
- [x] Detect when PM requests technical feasibility
- [x] Implement trigger for Technical Specification Agent
- [x] Update activity feed with tech agent status
- [x] Store technical analysis request in session

**Validation:** Insights agent recognizes feasibility request and triggers tech agent ✓

**Implementation Notes:**
- Enhanced Insights Agent prompt to automatically trigger tech analysis when PM asks about feasibility
- Implemented [TRIGGER_TECH_ANALYSIS] marker with JSON feature requirements format
- Created brace-matching parser for nested JSON objects in agent responses
- Tech Spec Agent performs autonomous analysis via `performAutonomousAnalysis`
- Activity feed shows "Autonomous analysis initiated" and "Technical specification complete"
- Tech specs stored in session automatically for Engineering Lead access
- Fixed API endpoint to return `techAnalysisTriggered` and `techAnalysisResult` to frontend

### Step 8.2: Share Technical Spec with Engineering ✅
- [x] Add "Share with Engineering" button to PM window
- [x] Enable button after technical analysis is complete
- [x] Store technical spec in session (accessible by Engineering Lead)
- [x] Show spec summary in Engineering window
- [x] Update activity feed with sharing action

**Implementation Notes:**
- Added `availableTechSpec` and `sharedTechSpecs` state to `useWorkflowState.js`
- Created `shareTechSpec()` handler that creates system message in Engineering window
- System messages styled with blue theme, centered, and distinct from agent messages
- Button enabled only when `availableTechSpec !== null` (after tech analysis completes)
- System message includes feature title, timestamp, and context for Engineering Lead
- Activity feed shows "Shared technical specification with Engineering: [Feature]"
- Improved Insights Agent prompt to provide substantial response BEFORE trigger marker
- PM now sees clear summary of requirements being analyzed, business context, and confirmation

**Validation:** PM can successfully share technical specifications with Engineering ✅

---

## Phase 9: Agent-to-Agent Communication

### Step 9.1: Insights Agent to Tech Agent Coordination ✅
- [x] Implement context package creation (Insights Agent → Tech Agent)
- [x] Retrieve relevant insights from session for tech analysis
- [x] Include feature requirements, business context, customer data
- [x] Store analysis request in session
- [x] Pass to Tech Agent as system message
- [x] Return Tech Agent response to Insights Agent
- [x] Store response in session for Engineering Lead access

**Implementation Notes:**
- Context package created via JSON in [TRIGGER_TECH_ANALYSIS] marker (insightsAgent.js:146-157)
- Insights retrieved from session via `getInsights(sessionId)` (insightsAgent.js:276)
- Feature requirements JSON includes: title, description, businessContext, technicalRequirements, customerData
- Analysis stored in `req.session.techSpecs` array (agents.js:196-204)
- Passed to Tech Agent via `performAutonomousAnalysis(sessionId, featureRequirements)` (insightsAgent.js:360)
- Tech Agent response returned with timestamp and feature title (insightsAgent.js:388-391)
- Full specification stored in session for Engineering Lead to access via GET /api/agents/techspec/list

**Validation:** Insights Agent successfully coordinates with Tech Agent via session data ✅

### Step 9.2: Activity Feed Integration ✅
- [x] Update activity feed when Insights Agent triggers Tech Agent
- [x] Stream Tech Agent progress to activity feed
- [x] Show completion status
- [x] Display in real-time regardless of active window

**Implementation Notes:**
- Activity feed updated when tech analysis triggered (useWorkflowState.js:187-194)
- Two activities added: "Autonomous analysis initiated" and "Technical specification complete"
- Activities include feature title for context
- Activity feed is global component, updates visible regardless of active window
- Activities timestamped and added to shared activities state
- Type 'working' for initiation, 'complete' for completion

**Validation:** All agent activity visible in feed during coordination ✅

**Phase 9 Note:** This phase was largely completed during Phase 8 implementation. The agent-to-agent communication infrastructure, session-based coordination, and activity feed integration were all implemented as part of the PM-to-Engineering workflow.

---

## Phase 10: Demo Flow Polish

### Step 10.1: Timing and Pacing ✅
- [x] Add elapsed time counter (starts at demo begin)
- [x] Update timeline progress indicators
- [x] Add smooth animations for message appearance
- [x] Implement appropriate loading states

**Implementation Notes:**
- Elapsed time counter already implemented in WorkflowTimeline.jsx:10-28 with 1-second interval updates
- Timeline progress indicators in WorkflowTimeline.jsx:30-75 show role status, message counts, and pulsing animation for active roles
- Message animations: fadeIn (RoleWindow.css:85-97) and slideIn (AgentActivityFeed.css:40-53)
- Loading states: animated bouncing dots in RoleWindow.jsx:67-80 with smooth CSS animations
- All transitions and animations use CSS transitions/keyframes for smooth, professional feel
- Auto-scroll to bottom with smooth behavior already implemented

**Validation:** Demo flow feels smooth and professional ✅
(All features were already implemented in previous phases)

### Step 10.2: Reset Functionality ✅
- [x] Implement reset button functionality
- [x] Clear all conversation history for all roles
- [x] Clear PM queue and Engineering specs
- [x] Clear activity feed
- [x] Reset timer

**Implementation Notes:**
- Added POST /api/insights/reset endpoint in server/routes/insights.js:181-208
- Endpoint clears both insights (via clearSessionInsights()) and tech specs (req.session.techSpecs)
- Updated resetWorkflow() in useWorkflowState.js:434-469 to call backend API before clearing frontend state
- Async reset function gracefully handles backend failures and continues with frontend reset
- Reset button already wired up in Layout.jsx:126 footer
- Clears all conversation history, activities, structured requests, insights, tech specs, and resets timer

**Validation:** Reset button clears all state and restarts demo ✅
User confirmed: PM agent correctly reports no insights after reset, full workflow works again

### Step 10.3: Error Handling ✅
- [x] Add user-friendly error messages
- [x] Implement retry logic for failed API calls
- [x] Show errors in activity feed
- [x] Prevent state corruption on errors

**Implementation Notes:**
- Created src/utils/apiUtils.js with retry and error handling utilities
- retryWithBackoff(): Exponential backoff with max 2 retries, initial delay 1s, max delay 5s
- isRetryableError(): Only retries server errors (5xx) and network errors, not client errors (4xx)
- getUserFriendlyErrorMessage(): Context-specific messages for different error types (network, timeout, HTTP status codes)
- Integrated retry logic into all three agent handlers (CSM, PM, Engineering)
- Enhanced error messages cover: network errors, timeouts, 401/403/404/429/500/502/503/504 status codes
- Error messages displayed in chat with ⚠️ icon and isError flag
- Errors logged to activity feed with 'error' type
- Loading states cleared in finally blocks (prevents state corruption)
- Retry attempts logged to console for debugging

**Validation:** Errors handled gracefully without breaking UI ✅

**Automated Tests Performed:**
- ✓ Retry logic unit tests (successful calls, network errors, server errors, client errors)
- ✓ Exponential backoff timing verification (~1s, ~2s delays)
- ✓ Server error responses (500) trigger retries
- ✓ Client error responses (400, 404) skip retries
- ✓ Code integration verified (imports and usage in all 3 agent handlers)
- ✓ API endpoint validation (returns proper error codes)

All tests passed successfully.

### Step 10.4: Visual Polish & Layout Redesign
- [x] Reduce top banner height to half current size
- [x] Add "Learn more" link to GitHub repo in banner
- [x] Move reset button from footer to top-right of banner
- [x] Move elapsed time timer to top banner (with reset button)
- [x] Redesign activity status panel to be as slim as possible
- [x] Remove bottom footer (reset button moved)
**Implementation** 

- notes: UI Changes done manually without Claude

**Validation:** UI is more compact, uses vertical space efficiently ✅

---

## Phase 11: Testing and Validation

### Step 11.1: Unit Tests ✅
- [x] Test mock data structure and exports
- [x] Test API utilities (retry logic and error handling)
- [x] Set up Vitest testing framework
- [x] Create comprehensive test suites

**Implementation Notes:**
- Installed Vitest 4.0.15 with @vitest/ui
- Created test files:
  - `src/data/mockCustomers.test.js` - 21 tests for customer data structure and helper functions
  - `src/data/mockRequests.test.js` - 22 tests for request data structure and helper functions
  - `src/utils/apiUtils.test.js` - 28 tests for retry logic, error classification, and user-friendly error messages
- Added npm scripts: `test`, `test:watch`, `test:ui`
- All 71 tests passing in 466ms
- Tests cover:
  - Data structure validation (types, required fields, valid values)
  - Helper function behavior (filtering, searching, aggregation)
  - Retry logic with exponential backoff
  - Error classification (retryable vs non-retryable)
  - User-friendly error message generation
  - Custom retry options and shouldRetry functions

**Validation:** All unit tests pass ✅
(71 tests in 3 test files, 100% passing)

### Step 11.2: Integration Tests ✅
- [x] Test full CSM conversation flow
- [x] Test full PM query flow
- [x] Test full Engineering refinement flow
- [x] Test agent-to-agent coordination
- [x] Test end-to-end workflow

**Implementation Notes:**
- Created comprehensive integration test scripts:
  - `server/test-integration-csm.js` - Tests Request Intake Agent workflow (5 steps, 25+ assertions)
  - `server/test-integration-pm.js` - Tests Customer Insights Agent workflow with tech analysis triggering
  - `server/test-integration-e2e.js` - Tests complete CSM → PM → Engineering workflow with agent coordination
- Tests validate:
  - Agent API endpoints return correct status codes
  - Structured data extraction from conversations
  - Data persistence via insights submission
  - Agent responses contain expected fields
  - Context is maintained across conversations
  - Agent-to-agent triggering (PM → Tech Agent)
  - Session-based state management
- All tests use native Node.js fetch API (Node 18+)
- Tests designed to work without browser cookie handling

**Validation:** All integration tests passing ✅
- CSM Conversation Flow: 25+ assertions (validates complete intake-to-submission flow)
- PM Query Flow: 15+ assertions (validates insights analysis and **Tech Agent auto-triggering**)
- End-to-End Workflow: 20+ assertions (validates complete CSM → PM → Engineering pipeline)

### Step 11.3: End-to-End Demo Test
- [ ] Run complete demo from CSM to Engineering
- [ ] Verify all data flows correctly
- [ ] Verify all agents respond appropriately
- [ ] Verify activity feed updates correctly
- [ ] Test reset functionality

**Validation:** Complete demo runs successfully

### Step 11.4: Edge Case Testing
- [ ] Test with various input types
- [ ] Test with empty inputs
- [ ] Test with very long messages
- [ ] Test rapid consecutive messages
- [ ] Test API timeout scenarios

**Validation:** App handles edge cases gracefully

---

## Phase 12: Deployment Preparation

### Step 12.1: Environment Configuration ✅
- [x] Create production environment configuration
- [x] Add environment variable validation
- [x] Configure API key security
- [x] Set up error logging

**Implementation Notes:**
- Enhanced `.env.example` with comprehensive documentation and security guidelines
- Created `server/config/validateEnv.js` for environment variable validation
  - Validates required variables (CLAUDE_API_KEY format)
  - Production-specific validation (SESSION_SECRET length, uniqueness)
  - Provides safe environment summary (masks sensitive values)
- Created `server/config/logger.js` for structured logging
  - Configurable log levels (error, warn, info, debug)
  - Request/response logging middleware
  - Enhanced error handler middleware
  - Timestamp-based structured logs
- Integrated validation and logging into server startup
  - Environment validation runs before server starts
  - Fails fast with clear error messages if validation fails
  - Displays masked configuration summary on startup

**Validation:** Production config works correctly ✅
Server starts successfully with validation checks, logs configuration summary

### Step 12.2: Build Optimization ✅
- [x] Optimize React build for production
- [x] Minify and bundle assets
- [x] Configure server for production mode
- [x] Test production build locally

**Implementation Notes:**
- Enhanced `vite.config.js` with production optimizations
  - Disabled source maps for smaller bundle size
  - esbuild minification for faster builds
  - Manual chunk splitting (separate React vendor bundle for better caching)
  - Optimized file naming with content hashes
  - ES2015 target for modern browser support
- Added production scripts to `package.json`
  - `npm start` - Production server (NODE_ENV=production)
  - `npm run start:prod` - Build and start production server
- Configured `server/server.js` for production static file serving
  - Serves built files from `dist/` folder in production
  - SPA fallback routing (index.html for all non-API routes)
  - Maintains separate development behavior

**Build Output:**
- Total bundle: ~366 KB (~110 KB gzipped)
- React vendor chunk: ~314 KB (~96 KB gzipped) - separately cached
- Application code: ~42 KB (~11 KB gzipped)
- Build time: ~2 seconds

**Validation:** Production build runs successfully ✅
Build completed in 1.90s with optimized, minified, and chunked assets

### Step 12.3: Documentation ✅
- [x] Create README.md with setup instructions
- [x] Document environment variables
- [x] Add API key setup guide
- [x] Create troubleshooting guide
- [x] Document mock data structure

**Implementation:**
- Enhanced README.md with comprehensive documentation
  - Expanded environment variables section with detailed descriptions
  - Added link to .env.example for complete reference
  - Documented production-specific variables
- Added comprehensive Troubleshooting guide covering:
  - Server startup issues (environment validation, port conflicts)
  - Frontend issues (network errors, data persistence)
  - AI agent issues (rate limits, API errors, token limits)
  - Testing issues (integration tests, unit tests)
  - Production build issues (blank page, API 404s)
  - Session issues (expiration, multi-tab behavior)
  - Debugging guidance (log levels, technical design reference)
- Documented Mock Data Structure with:
  - `mockCustomers.js` - Customer account data with helper functions
  - `mockRequests.js` - Historical feature requests for pattern matching
  - `mockCodebase.js` - Technical components for feasibility analysis
  - Schema examples and available helper functions for each module

**Validation:** New developer can set up project following README ✅
README provides complete setup instructions, troubleshooting guidance, and mock data documentation

### Step 12.4: Fly.io Account Setup (Manual)
**User Action Required:**
- [x] Visit https://fly.io/app/sign-up
- [x] Sign up with GitHub, Google, or Email
- [x] Install Fly CLI: `curl -L https://fly.io/install.sh | sh` (macOS/Linux)
  - Or download from: https://fly.io/docs/hands-on/install-flyctl/
- [x] Authenticate CLI: `fly auth login`

**Validation:** Fly CLI installed and authenticated ✅

### Step 12.5: Fly.io Deployment Configuration ✅
- [x] Run `fly launch` to create fly.toml configuration
- [x] Configure build settings for Node.js + Vite
- [x] Set environment variables: `fly secrets set CLAUDE_API_KEY=...` (pending user action)
- [x] Configure internal port (3001)
- [x] Set app region (arn - Stockholm)
- [x] Review and adjust fly.toml settings

**Implementation:**
- Created multi-stage Dockerfile for Node.js + Vite application:
  - Stage 1 (builder): Installs dependencies and builds frontend with Vite
  - Stage 2 (runtime): Production-only dependencies, serves built frontend + backend
  - Uses Node.js 18 Alpine for smaller image size
  - Exposes port 3001 for internal communication
- Updated fly.toml configuration:
  - Set internal_port to 3001 (matching our Express server)
  - Configured NODE_ENV=production and PORT=3001
  - Set concurrency limits (soft: 20, hard: 25 connections)
  - Configured VM resources (256MB memory, 1 shared CPU - free tier compatible)
  - Enabled auto-stop/auto-start for cost optimization
  - Primary region: arn (Stockholm, Europe)
- Updated .dockerignore to exclude:
  - node_modules (will be installed during build)
  - .env files (secrets managed via Fly.io)
  - Development files (tests, docs, IDE configs)
  - Build artifacts (dist rebuilt during Docker build)

**Next Steps (User Action Required):**
Before deploying, set the required secrets:
```bash
fly secrets set CLAUDE_API_KEY=your_actual_api_key_here
fly secrets set SESSION_SECRET=$(openssl rand -base64 32)
```

**Validation:** fly.toml created and configured correctly ✅
Multi-stage Dockerfile builds frontend and serves via Express backend on port 3001

### Step 12.6: Deploy to Fly.io ✅
- [x] Build production assets locally to verify
- [x] Deploy: `fly deploy` (initial deployment)
- [x] Monitor deployment logs and identify issues
- [x] Fix Issue 1: Server listening on wrong interface
- [x] Fix Issue 2: Missing mock data files in Docker image
- [x] Fix Issue 3: Hardcoded localhost URLs in frontend
- [x] Redeploy with all fixes: `fly deploy`
- [x] Test deployed version at https://agent-simulator.fly.dev
- [x] Verify health check endpoint
- [x] Test agent conversations
- [x] Verify session works correctly

**Implementation:**
- **Issue 1 - 502 Bad Gateway**: Server was listening on `localhost` (127.0.0.1) instead of `0.0.0.0`
  - **Root cause**: In containerized environments, localhost is only accessible within the container
  - **Fix**: Updated server.js to listen on `0.0.0.0` (all network interfaces)
    - Added `HOST` environment variable support (defaults to `0.0.0.0`)
    - Changed `app.listen(PORT)` to `app.listen(PORT, HOST)`
    - This allows Fly.io's reverse proxy to reach the application

- **Issue 2 - Module Not Found**: After redeployment, server crashed with `ERR_MODULE_NOT_FOUND: Cannot find module '/app/src/data/mockCustomers.js'`
  - **Root cause**: Dockerfile only copied `dist/` and `server/` directories, missing `src/data/`
  - Server agents import mock data from `src/data/mockCustomers.js`, `mockRequests.js`, and `mockCodebase.js`
  - **Fix**: Updated Dockerfile to copy `src/data` directory to production image
    - Added `COPY src/data ./src/data` after server copy

- **Issue 3 - Local Network Access Prompt**: After third deployment, browser showed dialog "agent-simulator.fly.dev wants to look for and connect to any device on your local network" when sending messages
  - **Root cause**: Frontend code had hardcoded `http://localhost:3001/api/...` URLs
  - In production, the browser blocks access to localhost from remote sites, triggering local network access prompt
  - **Fix**: Updated all fetch URLs to use relative paths (`/api/...`) instead of absolute localhost URLs
    - Works in development: Vite proxies `/api` to `localhost:3001` automatically
    - Works in production: Same origin, so `/api` resolves to `https://agent-simulator.fly.dev/api`
    - Fixed 5 fetch calls in `src/hooks/useWorkflowState.js`:
      - `/api/agents/intake` (CSM agent)
      - `/api/agents/insights` (PM agent)
      - `/api/agents/techspec` (Engineering agent)
      - `/api/insights/submit` (Submit insight)
      - `/api/insights/reset` (Reset workflow)

- Secrets configured via `fly secrets set`:
  - CLAUDE_API_KEY
  - SESSION_SECRET (generated with openssl rand -base64 32)

**Deployment Process:**
- Total of 4 deployments required to resolve all issues
- Each issue was identified through Fly.io logs or browser behavior
- Final deployment successful with all fixes applied

**Validation:** Application runs successfully on Fly.io ✅
- Site loads at https://agent-simulator.fly.dev
- Health check endpoint responds correctly
- Agent conversations work without errors
- No browser security prompts or local network access requests
- Session persistence works correctly across requests

### Step 12.7: Post-Deployment Setup
- [ ] Set up Fly.io monitoring (included in free tier)
- [ ] Configure auto-scaling limits (min: 1, max: 1 for free tier)
- [ ] Add deployment documentation to README
- [ ] Document environment variables needed
- [ ] Create troubleshooting guide for common Fly.io issues

**Validation:** Monitoring active and documentation complete

---

## Phase 13: Real-time Updates (Deferred - Post-Deployment Enhancement)

**Note:** This phase has been deferred until after initial deployment (Phase 12) as it is an advanced enhancement, not critical path functionality. The current implementation already provides good user experience with activity feed updates.

### Step 13.1: Server-Sent Events Setup
- [ ] Add SSE endpoint to Express server
- [ ] Implement event emitter for agent activities
- [ ] Configure SSE headers and keep-alive

**Validation:** SSE connection established from client

### Step 13.2: Streaming Agent Responses
- [ ] Stream Claude API responses to client
- [ ] Update activity feed in real-time
- [ ] Handle connection errors and reconnection

**Validation:** Agent responses stream smoothly to UI

### Step 13.3: Activity Feed Real-time Updates
- [ ] Connect activity feed to SSE stream
- [ ] Display agent work as it happens
- [ ] Auto-scroll to latest activity
- [ ] Show typing indicators for active agents

**Validation:** Activity feed updates live during agent work

---

## Phase 14: Future Enhancements (Post-V1)

### Step 14.1: Additional Scenarios
- [ ] Design customer support triage scenario
- [ ] Design sales qualification scenario
- [ ] Implement scenario selection UI
- [ ] Add scenario-specific mock data

### Step 14.2: Comparison Mode
- [ ] Implement traditional workflow timing
- [ ] Show side-by-side comparison
- [ ] Calculate time/meeting savings
- [ ] Add visual comparison dashboard

### Step 14.3: Customizable Mock Data
- [ ] Create UI for uploading custom customer data
- [ ] Create UI for uploading custom request data
- [ ] Validate uploaded data
- [ ] Use custom data in demo

### Step 14.4: Demo Recording/Playback
- [ ] Implement demo state recording
- [ ] Save demo sessions to file
- [ ] Create playback mode
- [ ] Add share/export functionality

---

## Development Guidelines

### Incremental Development Approach
1. Complete each step fully before moving to the next
2. Test and validate each step independently
3. Commit working code after each step
4. Keep steps small and focused (1-4 hours of work)
5. If a step is too large, break it down further

### Testing Strategy
- Write tests alongside implementation
- Validate with real Claude API calls early
- Test state transitions thoroughly
- Keep mock data realistic and useful

### Code Quality
- Use TypeScript for type safety (optional but recommended)
- Follow React best practices
- Keep components small and focused
- Comment complex logic
- Use consistent naming conventions

### Performance Considerations
- Debounce user input where appropriate
- Cache Claude API responses in development
- Optimize re-renders with React.memo
- Monitor API rate limits

---

## Estimated Timeline

- **Phase 1-2:** 1 day (Foundation + Basic UI) ✅
- **Phase 3:** 0.5 day (State Management) ✅
- **Phase 4:** 0.5 day (Backend Setup) ✅
- **Phase 5:** 2 days (Request Intake Agent) ✅
- **Phase 6:** 2 days (Product Queue Agent) ✅
- **Phase 7:** 2 days (Technical Spec Agent) ✅
- **Phase 8:** 1 day (Agent Coordination) ✅
- **Phase 9:** Completed during Phase 8 (Agent-to-Agent Communication) ✅
- **Phase 10:** 1 day (Demo Flow Polish) ✅
- **Phase 11:** 1 day (Testing)
- **Phase 12:** 1 day (Deployment)
- **Phase 13:** 1 day (Real-time Updates - Deferred post-deployment)

**Total Estimated Time for Critical Path (Phases 1-12):** ~12 days
**Completed:** ~9.5 days (Phases 1-9)

---

## Success Metrics

Each phase should demonstrate:
- [ ] Code compiles and runs without errors
- [ ] All tests pass
- [ ] Feature works as described in spec
- [ ] UI is responsive and accessible
- [ ] Agent responses are appropriate and helpful
- [ ] State management is clean and predictable
- [ ] Error handling prevents crashes

**Ready for next phase when:** All checkboxes in current phase are completed and validated.
