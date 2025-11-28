import { useState, useEffect } from 'react';
import './WorkflowTimeline.css';

function WorkflowTimeline({
  csmMessageCount = 0,
  pmMessageCount = 0,
  engMessageCount = 0,
  startTime
}) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getRoleStatus = (messageCount) => {
    if (messageCount === 0) return 'idle';
    return 'active';
  };

  return (
    <section className="workflow-timeline">
      <h3>📊 Activity Status</h3>
      <div className="timeline-content">
        <div className="timeline-roles">
          <div className={`timeline-role ${getRoleStatus(csmMessageCount)}`}>
            <span className="role-indicator">
              {csmMessageCount > 0 ? '●' : '○'}
            </span>
            <div className="role-info">
              <span className="role-label">CSM</span>
              <span className="role-count">
                {csmMessageCount > 0 ? `${csmMessageCount} messages` : 'No activity'}
              </span>
            </div>
          </div>

          <div className={`timeline-role ${getRoleStatus(pmMessageCount)}`}>
            <span className="role-indicator">
              {pmMessageCount > 0 ? '●' : '○'}
            </span>
            <div className="role-info">
              <span className="role-label">PM</span>
              <span className="role-count">
                {pmMessageCount > 0 ? `${pmMessageCount} messages` : 'No activity'}
              </span>
            </div>
          </div>

          <div className={`timeline-role ${getRoleStatus(engMessageCount)}`}>
            <span className="role-indicator">
              {engMessageCount > 0 ? '●' : '○'}
            </span>
            <div className="role-info">
              <span className="role-label">Engineering</span>
              <span className="role-count">
                {engMessageCount > 0 ? `${engMessageCount} messages` : 'No activity'}
              </span>
            </div>
          </div>
        </div>

        <div className="elapsed-time">
          <span className="time-icon">⏱️</span>
          <span className="time-value">{formatTime(elapsedTime)} elapsed</span>
        </div>
      </div>
    </section>
  );
}

export default WorkflowTimeline;
