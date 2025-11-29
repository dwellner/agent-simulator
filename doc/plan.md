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

## Phase 2: Basic UI Layout

**Design Decision:** The application uses a **parallel/flexible workflow model** where all three roles (CSM, PM, Engineering Lead) can be active and used simultaneously. This better demonstrates how AI agents work in parallel and supports a pull-based workflow where users can interact with any conversation at any time, in any order.

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

### Step 3.2: Integrate State Hook into Layout
- [ ] Import useWorkflowState hook in Layout.jsx
- [ ] Replace local state with hook state
- [ ] Verify all three roles remain active simultaneously
- [ ] Test message handling and activity tracking
- [ ] Ensure elapsed timer continues to work

**Validation:** Layout component works identically but with cleaner state management

### Step 3.3: Reset Functionality
- [ ] Implement resetWorkflow function in useWorkflowState hook
- [ ] Clear all conversation arrays
- [ ] Clear activity log
- [ ] Reset start time to current time
- [ ] Connect reset button in Layout.jsx to resetWorkflow
- [ ] Enable reset button (currently disabled)

**Validation:** Reset button clears all state and restarts demo

---

## Phase 4: Backend Setup

### Step 4.1: Basic Express Server
- [ ] Create `server/server.js` with Express setup
- [ ] Configure CORS for React frontend
- [ ] Add health check endpoint
- [ ] Set up error handling middleware
- [ ] Configure port from environment variables

**Validation:** Server runs and responds to health check

### Step 4.2: Claude API Service
- [ ] Create `server/services/claudeApi.js`
- [ ] Implement Claude API client initialization
- [ ] Add function to send messages to Claude
- [ ] Add streaming support for responses
- [ ] Implement error handling and retries

**Validation:** Successfully send test message to Claude API

### Step 4.3: Agent Routes
- [ ] Create `server/routes/agents.js`
- [ ] Add POST endpoint for intake agent conversation
- [ ] Add POST endpoint for queue agent conversation
- [ ] Add POST endpoint for tech spec agent conversation
- [ ] Add request validation

**Validation:** All endpoints respond with proper status codes

---

## Phase 5: Request Intake Agent (CSM Stage)

### Step 5.1: Intake Agent Prompt Engineering
- [ ] Create `server/agents/intakeAgent.js`
- [ ] Write system prompt for Request Intake Agent
- [ ] Define agent personality (proactive interviewer)
- [ ] Specify required information to extract
- [ ] Add mock data access instructions

**Validation:** Test prompt with sample input, verify agent asks clarifying questions

### Step 5.2: Intake Agent Context Integration
- [ ] Integrate customer database access into agent context
- [ ] Add historical requests to agent context
- [ ] Implement search for similar past requests
- [ ] Format context data for Claude API

**Validation:** Agent references customer data in responses

### Step 5.3: Intake Agent Structured Output
- [ ] Define structured request format (JSON schema)
- [ ] Implement extraction of structured data from conversation
- [ ] Store structured request in state
- [ ] Generate summary for CSM approval

**Validation:** Agent produces valid structured request data

### Step 5.4: CSM Conversation UI Integration
- [ ] Connect CSM RoleWindow to intake agent endpoint
- [ ] Implement message sending from UI
- [ ] Display agent responses in chat
- [ ] Add loading state during API calls
- [ ] Handle errors gracefully

**Validation:** Full conversation flow works between CSM and intake agent

### Step 5.5: Add Request to PM Queue
- [ ] Add "Add to PM Queue" button to CSM window
- [ ] Enable button only when request is structured and complete
- [ ] Implement action to add structured request to PM queue
- [ ] Show confirmation message in CSM window
- [ ] Update activity feed with queue addition

**Validation:** CSM can successfully add completed requests to PM queue

---

## Phase 6: Product Queue Agent (PM Stage)

### Step 6.1: Queue Agent Prompt Engineering
- [ ] Create `server/agents/queueAgent.js`
- [ ] Write system prompt for Product Queue Agent
- [ ] Define synthesizer and orchestrator personality
- [ ] Specify query capabilities
- [ ] Add queue access instructions

**Validation:** Test prompt with sample queries, verify synthesis behavior

### Step 6.2: Queue Management
- [ ] Implement PM queue data structure
- [ ] Add requests to queue from CSM conversations
- [ ] Provide queue context to agent
- [ ] Implement queue query functions (filter, group, sort)

**Validation:** Queue correctly stores and retrieves requests

### Step 6.3: Queue Agent Query Capabilities
- [ ] Implement pattern matching across requests
- [ ] Add aggregation functions (total ARR, customer count)
- [ ] Implement grouping by criteria (urgency, category)
- [ ] Add theme/pattern identification

**Validation:** Agent responds accurately to various query types

### Step 6.4: PM Conversation UI Integration
- [ ] Connect PM RoleWindow to queue agent endpoint
- [ ] Implement message sending from UI
- [ ] Display agent responses with formatted data
- [ ] Add loading state during API calls

**Validation:** PM can query queue successfully

### Step 6.5: Tech Agent Triggering
- [ ] Detect when PM requests technical feasibility
- [ ] Implement trigger for Technical Specification Agent
- [ ] Update activity feed with tech agent status
- [ ] Store technical analysis request

**Validation:** Queue agent recognizes feasibility request and triggers tech agent

### Step 6.6: Share Technical Spec with Engineering
- [ ] Add "Share with Engineering" button to PM window
- [ ] Enable button after technical analysis is complete
- [ ] Make technical spec available to Engineering Lead
- [ ] Show spec summary in Engineering window
- [ ] Update activity feed with sharing action

**Validation:** PM can successfully share technical specifications with Engineering

---

## Phase 7: Technical Specification Agent (Engineering Stage)

### Step 7.1: Tech Spec Agent Prompt Engineering
- [ ] Create `server/agents/techSpecAgent.js`
- [ ] Write system prompt for Technical Specification Agent
- [ ] Define technical analyst personality
- [ ] Specify autonomous analysis capabilities
- [ ] Add codebase reference instructions

**Validation:** Test prompt with sample feature, verify technical depth

### Step 7.2: Autonomous Analysis Mode
- [ ] Implement automatic trigger from Queue Agent
- [ ] Provide feature requirements to Tech Agent
- [ ] Provide mock codebase context
- [ ] Generate initial technical specification
- [ ] Stream analysis progress to activity feed

**Validation:** Tech agent generates complete specification autonomously

### Step 7.3: Technical Analysis Output
- [ ] Define technical specification format
- [ ] Include multiple approach options
- [ ] Add complexity estimates
- [ ] Identify risks and dependencies
- [ ] Format for Engineering Lead review

**Validation:** Specification includes all required sections

### Step 7.4: Conversational Refinement Mode
- [ ] Implement refinement conversation endpoint
- [ ] Allow Engineering Lead to ask questions
- [ ] Update recommendations based on feedback
- [ ] Maintain context from autonomous analysis

**Validation:** Engineering Lead can refine specification through conversation

### Step 7.5: Engineering Conversation UI Integration
- [ ] Connect Engineering RoleWindow to tech spec agent endpoint
- [ ] Display initial specification automatically
- [ ] Enable conversation for refinement
- [ ] Add loading state during API calls

**Validation:** Engineering Lead can review and refine specification

---

## Phase 8: Agent-to-Agent Communication

### Step 8.1: Queue Agent to Tech Agent Coordination
- [ ] Implement context package creation (Queue → Tech)
- [ ] Include feature requirements, business context, customer data
- [ ] Pass to Tech Agent as system message
- [ ] Return Tech Agent response to Queue Agent

**Validation:** Queue Agent successfully coordinates with Tech Agent

### Step 8.2: Activity Feed Integration
- [ ] Update activity feed when Queue Agent triggers Tech Agent
- [ ] Stream Tech Agent progress to activity feed
- [ ] Show completion status
- [ ] Display in real-time regardless of active window

**Validation:** All agent activity visible in feed during coordination

---

## Phase 9: Real-time Updates

### Step 9.1: Server-Sent Events Setup
- [ ] Add SSE endpoint to Express server
- [ ] Implement event emitter for agent activities
- [ ] Configure SSE headers and keep-alive

**Validation:** SSE connection established from client

### Step 9.2: Streaming Agent Responses
- [ ] Stream Claude API responses to client
- [ ] Update activity feed in real-time
- [ ] Handle connection errors and reconnection

**Validation:** Agent responses stream smoothly to UI

### Step 9.3: Activity Feed Real-time Updates
- [ ] Connect activity feed to SSE stream
- [ ] Display agent work as it happens
- [ ] Auto-scroll to latest activity
- [ ] Show typing indicators for active agents

**Validation:** Activity feed updates live during agent work

---

## Phase 10: Demo Flow Polish

### Step 10.1: Timing and Pacing
- [ ] Add elapsed time counter (starts at demo begin)
- [ ] Update timeline progress indicators
- [ ] Add smooth animations for message appearance
- [ ] Implement appropriate loading states

**Validation:** Demo flow feels smooth and professional

### Step 10.2: Reset Functionality
- [ ] Implement reset button functionality
- [ ] Clear all conversation history for all roles
- [ ] Clear PM queue and Engineering specs
- [ ] Clear activity feed
- [ ] Reset timer

**Validation:** Reset button clears all state and restarts demo

### Step 10.3: Error Handling
- [ ] Add user-friendly error messages
- [ ] Implement retry logic for failed API calls
- [ ] Show errors in activity feed
- [ ] Prevent state corruption on errors

**Validation:** Errors handled gracefully without breaking UI

### Step 10.4: Visual Polish
- [ ] Improve chat bubble styling
- [ ] Add smooth scroll animations
- [ ] Enhance active/inactive role indicators
- [ ] Polish timeline visual design
- [ ] Ensure consistent spacing and typography

**Validation:** UI looks professional and polished

---

## Phase 11: Testing and Validation

### Step 11.1: Unit Tests
- [ ] Test mock data structure and exports
- [ ] Test workflow state hook functions
- [ ] Test agent prompt construction
- [ ] Test structured data extraction

**Validation:** All unit tests pass

### Step 11.2: Integration Tests
- [ ] Test full CSM conversation flow
- [ ] Test full PM query flow
- [ ] Test full Engineering refinement flow
- [ ] Test agent-to-agent coordination
- [ ] Test parallel multi-role workflows

**Validation:** All integration tests pass

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

### Step 12.1: Environment Configuration
- [ ] Create production environment configuration
- [ ] Add environment variable validation
- [ ] Configure API key security
- [ ] Set up error logging

**Validation:** Production config works correctly

### Step 12.2: Build Optimization
- [ ] Optimize React build for production
- [ ] Minify and bundle assets
- [ ] Configure server for production mode
- [ ] Test production build locally

**Validation:** Production build runs successfully

### Step 12.3: Documentation
- [ ] Create README.md with setup instructions
- [ ] Document environment variables
- [ ] Add API key setup guide
- [ ] Create troubleshooting guide
- [ ] Document mock data structure

**Validation:** New developer can set up project following README

### Step 12.4: Deployment
- [ ] Choose deployment platform (Heroku, Vercel, Railway, etc.)
- [ ] Configure deployment settings
- [ ] Deploy application
- [ ] Test deployed version
- [ ] Set up monitoring/logging

**Validation:** Application runs successfully in production

---

## Phase 13: Future Enhancements (Post-V1)

### Step 13.1: Additional Scenarios
- [ ] Design customer support triage scenario
- [ ] Design sales qualification scenario
- [ ] Implement scenario selection UI
- [ ] Add scenario-specific mock data

### Step 13.2: Comparison Mode
- [ ] Implement traditional workflow timing
- [ ] Show side-by-side comparison
- [ ] Calculate time/meeting savings
- [ ] Add visual comparison dashboard

### Step 13.3: Customizable Mock Data
- [ ] Create UI for uploading custom customer data
- [ ] Create UI for uploading custom request data
- [ ] Validate uploaded data
- [ ] Use custom data in demo

### Step 13.4: Demo Recording/Playback
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
