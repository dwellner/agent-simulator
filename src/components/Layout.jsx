import { useState } from 'react';
import RoleWindow from './RoleWindow';
import WorkflowTimeline from './WorkflowTimeline';
import AgentActivityFeed from './AgentActivityFeed';
import useWorkflowState from '../hooks/useWorkflowState';
import './Layout.css';

function Layout() {
  const [justAddedToQueue, setJustAddedToQueue] = useState(false);
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
    handleCsmMessage,
    handlePmMessage,
    handleEngMessage,
    submitInsight,
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

  return (
    <div className="layout">
      <header className="layout-header">
        <h1>AI-Enhanced Product Workflow Demo</h1>
        <p className="subtitle">See how AI agents transform product development workflows</p>
      </header>

      <main className="layout-main">
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

        {/* Bottom Section - Workflow Timeline */}
        <WorkflowTimeline
          csmMessageCount={csmMessages.length}
          pmMessageCount={pmMessages.length}
          engMessageCount={engMessages.length}
          startTime={startTime}
        />
      </main>

      <footer className="layout-footer">
        <button className="reset-button" onClick={resetWorkflow}>
          Reset Demo
        </button>
      </footer>
    </div>
  );
}

export default Layout;
