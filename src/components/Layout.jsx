import { useState } from 'react';
import RoleWindow from './RoleWindow';
import WorkflowTimeline from './WorkflowTimeline';
import AgentActivityFeed from './AgentActivityFeed';
import useWorkflowState from '../hooks/useWorkflowState';
import './Layout.css';

function Layout() {
  const [justAddedToQueue, setJustAddedToQueue] = useState(false);
  const [justSharedSpec, setJustSharedSpec] = useState(false);
  const {
    startTime,
    csmMessages,
    pmMessages,
    engMessages,
    activities,
    structuredRequest,
    customerInsights,
    csmLoading,
    pmLoading,
    engLoading,
    availableTechSpec,
    sharedTechSpecs,
    handleCsmMessage,
    handlePmMessage,
    handleEngMessage,
    submitInsight,
    shareTechSpec,
    resetWorkflow
  } = useWorkflowState();

  // Handle submitting insight to PM
  const handleSubmitInsight = () => {
    submitInsight();
    setJustAddedToQueue(true);
    setTimeout(() => setJustAddedToQueue(false), 2000);
  };

  // Check if we can submit insight (request exists and has minimum completeness)
  const canSubmitInsight = structuredRequest && structuredRequest.meta.completeness >= 50;

  // Create the Submit Insight button for CSM window
  const submitInsightButton = (
    <button
      onClick={handleSubmitInsight}
      disabled={!canSubmitInsight || justAddedToQueue}
      className={`action-button ${justAddedToQueue ? 'success' : ''}`}
      title={!canSubmitInsight ? 'Complete the request details first' : 'Submit this customer insight to PM'}
    >
      {justAddedToQueue ? '✓ Insight Submitted!' : 'Submit Insight'}
    </button>
  );

  // Handle sharing tech spec with Engineering
  const handleShareTechSpec = () => {
    shareTechSpec();
    setJustSharedSpec(true);
    setTimeout(() => setJustSharedSpec(false), 2000);
  };

  // Check if we can share tech spec (tech analysis completed)
  const canShareTechSpec = availableTechSpec !== null;

  // Create the Share with Engineering button for PM window
  const shareTechSpecButton = (
    <button
      onClick={handleShareTechSpec}
      disabled={!canShareTechSpec || justSharedSpec}
      className={`action-button ${justSharedSpec ? 'success' : ''}`}
      title={!canShareTechSpec ? 'Request technical feasibility analysis first' : 'Share this technical specification with Engineering'}
    >
      {justSharedSpec ? '✓ Shared with Engineering!' : 'Share with Engineering'}
    </button>
  );

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-left">
          <h1>AI-Enhanced Product Workflow Demo</h1>
          <a
            href="https://github.com/dwellner/agent-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            Learn more →
          </a>
        </div>
      </header>

      <main className="layout-main">
        <div className="header-right">
          <WorkflowTimeline
            csmMessageCount={csmMessages.length}
            pmMessageCount={pmMessages.length}
            engMessageCount={engMessages.length}
            startTime={startTime}
            resetWorkflow={resetWorkflow}
          />
        </div>

        {/* Top Section - Three Role Windows */}
        <section className="role-windows">
          <RoleWindow
            title="Customer Success Manager"
            isActive={true}
            messages={csmMessages}
            onSendMessage={handleCsmMessage}
            isLoading={csmLoading}
            actionButton={submitInsightButton}
          />

          <RoleWindow
            title="Product Manager"
            isActive={true}
            messages={pmMessages}
            onSendMessage={handlePmMessage}
            isLoading={pmLoading}
            actionButton={shareTechSpecButton}
          />

          <RoleWindow
            title="Engineering Lead"
            isActive={true}
            messages={engMessages}
            onSendMessage={handleEngMessage}
            isLoading={engLoading}
          />
        </section>

        {/* Middle Section - Agent Activity Feed */}
        <AgentActivityFeed activities={activities} />
      </main>
    </div>
  );
}

export default Layout;
