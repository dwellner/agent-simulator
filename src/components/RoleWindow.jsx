import { useState, useRef, useEffect } from 'react';
import './RoleWindow.css';

function RoleWindow({
  title,
  isActive,
  messages = [],
  onSendMessage,
  onHandoff,
  showHandoffButton = false
}) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleHandoff = () => {
    if (onHandoff) {
      onHandoff();
    }
  };

  return (
    <div className={`role-window ${isActive ? 'active' : 'inactive'}`}>
      <div className="role-header">
        <h2>{title}</h2>
        <span className={`role-status ${isActive ? 'active' : 'waiting'}`}>
          {isActive ? 'Active ✓' : 'Waiting...'}
        </span>
      </div>

      <div className="role-content">
        {messages.length === 0 ? (
          <p className="placeholder">
            {isActive
              ? `Start the conversation...`
              : 'Waiting for handoff...'}
          </p>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user-message' : 'agent-message'}`}
              >
                <div className="message-header">
                  <span className="message-sender">
                    {message.role === 'user' ? title : 'AI Agent'}
                  </span>
                  {message.timestamp && (
                    <span className="message-timestamp">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="role-input">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isActive ? 'Type your message...' : 'Disabled'}
            disabled={!isActive}
            className="message-input"
          />
          <button
            type="submit"
            disabled={!isActive || !inputValue.trim()}
            className="send-button"
          >
            Send
          </button>
        </form>
        {showHandoffButton && (
          <button
            onClick={handleHandoff}
            className="handoff-button"
            disabled={!isActive}
          >
            Hand off to next stage →
          </button>
        )}
      </div>
    </div>
  );
}

export default RoleWindow;
