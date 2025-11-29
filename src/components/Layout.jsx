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
    featureQueue,
    csmLoading,
    pmLoading,
    engLoading,
    handleCsmMessage,
    handlePmMessage,
    handleEngMessage,
    addToQueue,
    resetWorkflow
  } = useWorkflowState();

  // Handle adding request to PM queue
  const handleAddToQueue = () => {
    addToQueue();
    setJustAddedToQueue(true);
    setTimeout(() => setJustAddedToQueue(false), 2000);
  };

  // Check if we can add to queue (request exists and has minimum completeness)
  const canAddToQueue = structuredRequest && structuredRequest.meta.completeness >= 50;

  // Create the Add to Queue button for CSM window
  const addToQueueButton = (
    <button
      onClick={handleAddToQueue}
      disabled={!canAddToQueue || justAddedToQueue}
      className={`action-button ${justAddedToQueue ? 'success' : ''}`}
      title={!canAddToQueue ? 'Complete the request details first' : 'Add this request to the PM queue'}
    >
      {justAddedToQueue ? '✓ Added to Queue!' : '+ Add to PM Queue'}
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
            actionButton={addToQueueButton}
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
