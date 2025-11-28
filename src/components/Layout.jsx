import { useState } from 'react';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>AI-Enhanced Product Workflow Demo</h1>
        <p className="subtitle">See how AI agents transform product development workflows</p>
      </header>

      <main className="layout-main">
        {/* Top Section - Three Role Windows */}
        <section className="role-windows">
          <div className="role-window">
            <div className="role-header">
              <h2>Customer Success Manager</h2>
              <span className="role-status active">Active ✓</span>
            </div>
            <div className="role-content">
              <p className="placeholder">CSM conversation window placeholder</p>
            </div>
          </div>

          <div className="role-window">
            <div className="role-header">
              <h2>Product Manager</h2>
              <span className="role-status waiting">Waiting...</span>
            </div>
            <div className="role-content">
              <p className="placeholder">PM conversation window placeholder</p>
            </div>
          </div>

          <div className="role-window">
            <div className="role-header">
              <h2>Engineering Lead</h2>
              <span className="role-status waiting">Waiting...</span>
            </div>
            <div className="role-content">
              <p className="placeholder">Engineering conversation window placeholder</p>
            </div>
          </div>
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
