import RoleWindow from './RoleWindow';
import WorkflowTimeline from './WorkflowTimeline';
import AgentActivityFeed from './AgentActivityFeed';
import useWorkflowState from '../hooks/useWorkflowState';
import './Layout.css';

function Layout() {
  const {
    startTime,
    csmMessages,
    pmMessages,
    engMessages,
    activities,
    handleCsmMessage,
    handlePmMessage,
    handleEngMessage,
    resetWorkflow
  } = useWorkflowState();

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
          />

          <RoleWindow
            title="Product Manager"
            isActive={true}
            messages={pmMessages}
            onSendMessage={handlePmMessage}
          />

          <RoleWindow
            title="Engineering Lead"
            isActive={true}
            messages={engMessages}
            onSendMessage={handleEngMessage}
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
