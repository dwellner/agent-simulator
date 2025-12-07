import { useRef, useEffect } from 'react';
import './AgentActivityFeed.css';
import AgentActivityItem from './AgentActivityItem';

function AgentActivityFeed({ activities = [] }) {

  const newestFirst = (a, b) => new Date(b.timestamp) - new Date(a.timestamp);

  return (
    <section className="agent-activity-feed">
      <h3>🤖 Agent Background Activity (Live)</h3>
      <div className="activity-content">
        {activities.length === 0 ? (
          <p className="activity-placeholder">
            No agent activity yet. Start a conversation to see agents working in the background.
          </p>
        ) : (
          <>
            {activities.sort(newestFirst).map((activity, index) => (
              <AgentActivityItem
                key={index}
                activity={activity}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

export default AgentActivityFeed;
