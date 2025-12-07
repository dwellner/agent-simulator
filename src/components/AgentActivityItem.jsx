import './AgentActivityItem.css';

function AgentActivityItem({ index, activity }) {

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
        <div className={`activity-item ${activity.type}`}>
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
    );
}

export default AgentActivityItem;