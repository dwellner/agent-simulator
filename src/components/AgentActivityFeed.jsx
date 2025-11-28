import { useRef, useEffect } from 'react';
import './AgentActivityFeed.css';

function AgentActivityFeed({ activities = [] }) {
  const activitiesEndRef = useRef(null);

  const scrollToBottom = () => {
    activitiesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activities]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'working':
        return '⚡';
      case 'complete':
        return '✓';
      case 'search':
        return '🔍';
      case 'analysis':
        return '📊';
      case 'error':
        return '⚠️';
      default:
        return '●';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

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
            {activities.map((activity, index) => (
              <div
                key={index}
                className={`activity-item ${activity.type}`}
              >
                <span className="activity-icon">
                  {getActivityIcon(activity.type)}
                </span>
                <div className="activity-details">
                  <div className="activity-header">
                    <span className="activity-agent">{activity.agent}</span>
                    <span className="activity-timestamp">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <div className="activity-message">{activity.message}</div>
                </div>
              </div>
            ))}
            <div ref={activitiesEndRef} />
          </>
        )}
      </div>
    </section>
  );
}

export default AgentActivityFeed;
