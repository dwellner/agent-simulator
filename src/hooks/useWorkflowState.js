import { useState } from 'react';

/**
 * Custom hook for managing workflow state across all three roles (CSM, PM, Engineering).
 * Supports parallel workflow where all roles can be active simultaneously.
 */
function useWorkflowState() {
  const [startTime, setStartTime] = useState(Date.now());
  const [csmMessages, setCsmMessages] = useState([]);
  const [pmMessages, setPmMessages] = useState([]);
  const [engMessages, setEngMessages] = useState([]);
  const [activities, setActivities] = useState([]);

  /**
   * Handle CSM (Customer Success Manager) messages
   */
  const handleCsmMessage = (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setCsmMessages(prev => [...prev, newMessage]);

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

  /**
   * Handle PM (Product Manager) messages
   */
  const handlePmMessage = (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setPmMessages(prev => [...prev, newMessage]);

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

  /**
   * Handle Engineering Lead messages
   */
  const handleEngMessage = (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setEngMessages(prev => [...prev, newMessage]);

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

  /**
   * Reset all workflow state
   */
  const resetWorkflow = () => {
    setCsmMessages([]);
    setPmMessages([]);
    setEngMessages([]);
    setActivities([]);
    setStartTime(Date.now());
  };

  return {
    // State
    startTime,
    csmMessages,
    pmMessages,
    engMessages,
    activities,

    // Handlers
    handleCsmMessage,
    handlePmMessage,
    handleEngMessage,

    // Actions
    resetWorkflow
  };
}

export default useWorkflowState;
