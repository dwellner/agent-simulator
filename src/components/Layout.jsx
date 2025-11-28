import { useState } from 'react';
import RoleWindow from './RoleWindow';
import './Layout.css';

function Layout() {
  const [csmMessages, setCsmMessages] = useState([]);
  const [pmMessages, setPmMessages] = useState([]);
  const [engMessages, setEngMessages] = useState([]);

  const handleCsmMessage = (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setCsmMessages([...csmMessages, newMessage]);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage = {
        role: 'agent',
        content: 'This is a demo response from the Request Intake Agent. In the full implementation, this will connect to the Claude API.',
        timestamp: new Date().toISOString()
      };
      setCsmMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const handlePmMessage = (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setPmMessages([...pmMessages, newMessage]);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage = {
        role: 'agent',
        content: 'This is a demo response from the Product Queue Agent. In the full implementation, this will connect to the Claude API.',
        timestamp: new Date().toISOString()
      };
      setPmMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const handleEngMessage = (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setEngMessages([...engMessages, newMessage]);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage = {
        role: 'agent',
        content: 'This is a demo response from the Technical Specification Agent. In the full implementation, this will connect to the Claude API.',
        timestamp: new Date().toISOString()
      };
      setEngMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

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
        <section className="activity-feed">
          <h3>🤖 Agent Background Activity (Live)</h3>
          <div className="activity-content">
            <p className="activity-item">⚡ Request Intake Agent: Searching for similar requests...</p>
            <p className="activity-item">✓ Found 47 similar cases across 3 customer segments</p>
            <p className="activity-item">⚡ Product Queue Agent: Analyzing urgency factors...</p>
          </div>
        </section>

        {/* Bottom Section - Workflow Timeline */}
        <section className="workflow-timeline">
          <h3>📊 Workflow Timeline</h3>
          <div className="timeline-content">
            <div className="timeline-stages">
              <div className="timeline-stage active">
                <span className="stage-indicator">●</span>
                <span className="stage-label">CSM Intake</span>
              </div>
              <div className="timeline-stage pending">
                <span className="stage-indicator">○</span>
                <span className="stage-label">PM Review</span>
              </div>
              <div className="timeline-stage pending">
                <span className="stage-indicator">○</span>
                <span className="stage-label">Eng Review</span>
              </div>
            </div>
            <p className="elapsed-time">✓ 0m 0s elapsed</p>
          </div>
        </section>
      </main>

      <footer className="layout-footer">
        <button className="reset-button" disabled>
          Reset Demo
        </button>
      </footer>
    </div>
  );
}

export default Layout;
