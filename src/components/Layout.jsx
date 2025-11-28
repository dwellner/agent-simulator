import { useState } from 'react';
import RoleWindow from './RoleWindow';
import WorkflowTimeline from './WorkflowTimeline';
import AgentActivityFeed from './AgentActivityFeed';
import './Layout.css';

function Layout() {
  const [startTime] = useState(Date.now());
  const [csmMessages, setCsmMessages] = useState([]);
  const [pmMessages, setPmMessages] = useState([]);
  const [engMessages, setEngMessages] = useState([]);
  const [activities, setActivities] = useState([]);

  const handleCsmMessage = (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setCsmMessages([...csmMessages, newMessage]);

    // Add agent activity
    setActivities(prev => [...prev, {
      type: 'working',
      agent: 'Request Intake Agent',
      message: 'Processing customer request and searching for similar cases...',
      timestamp: new Date().toISOString()
    }]);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage = {
        role: 'agent',
        content: 'This is a demo response from the Request Intake Agent. In the full implementation, this will connect to the Claude API.',
        timestamp: new Date().toISOString()
      };
      setCsmMessages(prev => [...prev, agentMessage]);

      setActivities(prev => [...prev, {
        type: 'complete',
        agent: 'Request Intake Agent',
        message: 'Response generated successfully',
        timestamp: new Date().toISOString()
      }]);
    }, 1000);
  };

  const handlePmMessage = (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setPmMessages([...pmMessages, newMessage]);

    // Add agent activity
    setActivities(prev => [...prev, {
      type: 'analysis',
      agent: 'Product Queue Agent',
      message: 'Analyzing queue and synthesizing across requests...',
      timestamp: new Date().toISOString()
    }]);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage = {
        role: 'agent',
        content: 'This is a demo response from the Product Queue Agent. In the full implementation, this will connect to the Claude API.',
        timestamp: new Date().toISOString()
      };
      setPmMessages(prev => [...prev, agentMessage]);

      setActivities(prev => [...prev, {
        type: 'complete',
        agent: 'Product Queue Agent',
        message: 'Queue analysis complete',
        timestamp: new Date().toISOString()
      }]);
    }, 1000);
  };

  const handleEngMessage = (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setEngMessages([...engMessages, newMessage]);

    // Add agent activity
    setActivities(prev => [...prev, {
      type: 'search',
      agent: 'Technical Specification Agent',
      message: 'Reviewing codebase architecture and past implementations...',
      timestamp: new Date().toISOString()
    }]);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage = {
        role: 'agent',
        content: 'This is a demo response from the Technical Specification Agent. In the full implementation, this will connect to the Claude API.',
        timestamp: new Date().toISOString()
      };
      setEngMessages(prev => [...prev, agentMessage]);

      setActivities(prev => [...prev, {
        type: 'complete',
        agent: 'Technical Specification Agent',
        message: 'Technical analysis complete',
        timestamp: new Date().toISOString()
      }]);
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
        <button className="reset-button" disabled>
          Reset Demo
        </button>
      </footer>
    </div>
  );
}

export default Layout;
