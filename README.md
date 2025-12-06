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
- **Data Flow**: RESTful APIs with session-based persistence

---

## Project Status

### ✅ Completed Features (Phases 1-8)

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

### 🚧 In Progress

- **Phase 9**: Enhanced agent-to-agent communication
- **Phase 10**: Visual enhancements and animations
- **Phase 11**: Production readiness

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
# Test PM → Tech Agent trigger
node server/test-pm-tech-trigger.js

# Test Tech Spec Agent modes
node server/test-tech-agent.js
```

### Environment Variables

```bash
# Required
CLAUDE_API_KEY=sk-ant-...              # Anthropic API key
SESSION_SECRET=your-secret-key         # Session signing secret

# Optional
NODE_ENV=development                   # Environment
PORT=3001                              # Backend port
VITE_PORT=5173                        # Frontend port
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
│   └── data/              # Mock data
├── src/                   # Frontend
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   └── App.jsx
└── package.json
```

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
