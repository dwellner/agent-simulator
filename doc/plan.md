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

### Step 7.1: Tech Spec Agent Prompt Engineering
- [ ] Create `server/agents/techSpecAgent.js`
- [ ] Write system prompt for Technical Specification Agent
- [ ] Define technical analyst personality
- [ ] Specify autonomous analysis capabilities
- [ ] Add codebase reference instructions

**Validation:** Test prompt with sample feature, verify technical depth

### Step 7.2: Autonomous Analysis Mode
- [ ] Implement automatic trigger from Insights Agent
- [ ] Retrieve feature requirements from session
- [ ] Provide mock codebase context
- [ ] Generate initial technical specification
- [ ] Store tech spec in session
- [ ] Stream analysis progress to activity feed

**Validation:** Tech agent generates complete specification autonomously and stores in session

### Step 7.3: Technical Analysis Output
- [ ] Define technical specification format
- [ ] Include multiple approach options
- [ ] Add complexity estimates
- [ ] Identify risks and dependencies
- [ ] Format for Engineering Lead review
- [ ] Ensure spec is retrievable from session

**Validation:** Specification includes all required sections and is stored in session

### Step 7.4: Conversational Refinement Mode
- [ ] Implement refinement conversation endpoint
- [ ] Retrieve existing tech spec from session
- [ ] Allow Engineering Lead to ask questions
- [ ] Update recommendations based on feedback
- [ ] Update stored spec in session
- [ ] Maintain context from autonomous analysis

**Validation:** Engineering Lead can refine specification and changes persist in session

### Step 7.5: Engineering Conversation UI Integration
- [ ] Update Engineering handler to call tech spec endpoint
- [ ] Ensure session ID is passed with requests
- [ ] Display initial specification automatically when available
- [ ] Enable conversation for refinement
- [ ] Add loading state during API calls (already implemented)

**Validation:** Engineering Lead can review and refine specification with session persistence

---

## Phase 8: PM-to-Engineering Workflow Integration

### Step 8.1: Tech Agent Triggering from PM
- [ ] Detect when PM requests technical feasibility
- [ ] Implement trigger for Technical Specification Agent
- [ ] Update activity feed with tech agent status
- [ ] Store technical analysis request in session

**Validation:** Insights agent recognizes feasibility request and triggers tech agent

### Step 8.2: Share Technical Spec with Engineering
- [ ] Add "Share with Engineering" button to PM window
- [ ] Enable button after technical analysis is complete
- [ ] Store technical spec in session (accessible by Engineering Lead)
- [ ] Show spec summary in Engineering window
- [ ] Update activity feed with sharing action

**Validation:** PM can successfully share technical specifications with Engineering

---

## Phase 9: Agent-to-Agent Communication

### Step 9.1: Insights Agent to Tech Agent Coordination
- [ ] Implement context package creation (Insights Agent → Tech Agent)
- [ ] Retrieve relevant insights from session for tech analysis
- [ ] Include feature requirements, business context, customer data
- [ ] Store analysis request in session
- [ ] Pass to Tech Agent as system message
- [ ] Return Tech Agent response to Insights Agent
- [ ] Store response in session for Engineering Lead access

**Validation:** Insights Agent successfully coordinates with Tech Agent via session data

### Step 9.2: Activity Feed Integration
- [ ] Update activity feed when Insights Agent triggers Tech Agent
- [ ] Stream Tech Agent progress to activity feed
- [ ] Show completion status
- [ ] Display in real-time regardless of active window

**Validation:** All agent activity visible in feed during coordination

---

## Phase 10: Real-time Updates

### Step 10.1: Server-Sent Events Setup
- [ ] Add SSE endpoint to Express server
- [ ] Implement event emitter for agent activities
- [ ] Configure SSE headers and keep-alive

**Validation:** SSE connection established from client

### Step 10.2: Streaming Agent Responses
- [ ] Stream Claude API responses to client
- [ ] Update activity feed in real-time
- [ ] Handle connection errors and reconnection

**Validation:** Agent responses stream smoothly to UI

### Step 10.3: Activity Feed Real-time Updates
- [ ] Connect activity feed to SSE stream
- [ ] Display agent work as it happens
- [ ] Auto-scroll to latest activity
- [ ] Show typing indicators for active agents

**Validation:** Activity feed updates live during agent work

---

## Phase 11: Demo Flow Polish

### Step 13.1: Timing and Pacing
- [ ] Add elapsed time counter (starts at demo begin)
- [ ] Update timeline progress indicators
- [ ] Add smooth animations for message appearance
- [ ] Implement appropriate loading states

**Validation:** Demo flow feels smooth and professional

### Step 13.2: Reset Functionality
- [ ] Implement reset button functionality
- [ ] Clear all conversation history for all roles
- [ ] Clear PM queue and Engineering specs
- [ ] Clear activity feed
- [ ] Reset timer

**Validation:** Reset button clears all state and restarts demo

### Step 13.3: Error Handling
- [ ] Add user-friendly error messages
- [ ] Implement retry logic for failed API calls
- [ ] Show errors in activity feed
- [ ] Prevent state corruption on errors

**Validation:** Errors handled gracefully without breaking UI

### Step 13.4: Visual Polish
- [ ] Improve chat bubble styling
- [ ] Add smooth scroll animations
- [ ] Enhance active/inactive role indicators
- [ ] Polish timeline visual design
- [ ] Ensure consistent spacing and typography

**Validation:** UI looks professional and polished

---

## Phase 12: Testing and Validation

### Step 13.1: Unit Tests
- [ ] Test mock data structure and exports
- [ ] Test workflow state hook functions
- [ ] Test agent prompt construction
- [ ] Test structured data extraction

**Validation:** All unit tests pass

### Step 13.2: Integration Tests
- [ ] Test full CSM conversation flow
- [ ] Test full PM query flow
- [ ] Test full Engineering refinement flow
- [ ] Test agent-to-agent coordination
- [ ] Test parallel multi-role workflows

**Validation:** All integration tests pass

### Step 13.3: End-to-End Demo Test
- [ ] Run complete demo from CSM to Engineering
- [ ] Verify all data flows correctly
- [ ] Verify all agents respond appropriately
- [ ] Verify activity feed updates correctly
- [ ] Test reset functionality

**Validation:** Complete demo runs successfully

### Step 13.4: Edge Case Testing
- [ ] Test with various input types
- [ ] Test with empty inputs
- [ ] Test with very long messages
- [ ] Test rapid consecutive messages
- [ ] Test API timeout scenarios

**Validation:** App handles edge cases gracefully

---

## Phase 13: Deployment Preparation

### Step 13.1: Environment Configuration
- [ ] Create production environment configuration
- [ ] Add environment variable validation
- [ ] Configure API key security
- [ ] Set up error logging

**Validation:** Production config works correctly

### Step 13.2: Build Optimization
- [ ] Optimize React build for production
- [ ] Minify and bundle assets
- [ ] Configure server for production mode
- [ ] Test production build locally

**Validation:** Production build runs successfully

### Step 13.3: Documentation
- [ ] Create README.md with setup instructions
- [ ] Document environment variables
- [ ] Add API key setup guide
- [ ] Create troubleshooting guide
- [ ] Document mock data structure

**Validation:** New developer can set up project following README

### Step 13.4: Fly.io Account Setup (Manual)
**User Action Required:**
- [ ] Visit https://fly.io/app/sign-up
- [ ] Sign up with GitHub, Google, or Email
- [ ] Verify email address
- [ ] No credit card required for free tier
- [ ] Install Fly CLI: `curl -L https://fly.io/install.sh | sh` (macOS/Linux)
  - Or download from: https://fly.io/docs/hands-on/install-flyctl/
- [ ] Authenticate CLI: `fly auth login`

**Validation:** Fly CLI installed and authenticated

### Step 13.5: Fly.io Deployment Configuration
- [ ] Run `fly launch` to create fly.toml configuration
- [ ] Configure build settings for Node.js + Vite
- [ ] Set environment variables: `fly secrets set CLAUDE_API_KEY=...`
- [ ] Configure internal port (3001)
- [ ] Set app region (choose closest to target users)
- [ ] Review and adjust fly.toml settings

**Validation:** fly.toml created and configured correctly

### Step 13.6: Deploy to Fly.io
- [ ] Build production assets locally to verify
- [ ] Deploy: `fly deploy`
- [ ] Monitor deployment logs
- [ ] Test deployed version at https://[app-name].fly.dev
- [ ] Verify health check endpoint
- [ ] Test all three agent conversations
- [ ] Verify session isolation works

**Validation:** Application runs successfully on Fly.io

### Step 13.7: Post-Deployment Setup
- [ ] Set up Fly.io monitoring (included in free tier)
- [ ] Configure auto-scaling limits (min: 1, max: 1 for free tier)
- [ ] Add deployment documentation to README
- [ ] Document environment variables needed
- [ ] Create troubleshooting guide for common Fly.io issues

**Validation:** Monitoring active and documentation complete

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

- **Phase 1-2:** 1 day (Foundation + Basic UI)
- **Phase 3:** 0.5 day (State Management)
- **Phase 4:** 0.5 day (Backend Setup)
- **Phase 5:** 2 days (Request Intake Agent)
- **Phase 6:** 2 days (Product Queue Agent)
- **Phase 7:** 2 days (Technical Spec Agent)
- **Phase 8:** 1 day (Agent Coordination)
- **Phase 9:** 1 day (Real-time Updates)
- **Phase 10:** 1 day (Polish)
- **Phase 11:** 1 day (Testing)
- **Phase 12:** 1 day (Deployment)

**Total Estimated Time:** ~13 days for core V1

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
