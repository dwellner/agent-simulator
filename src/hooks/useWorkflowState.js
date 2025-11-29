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
  const [structuredRequest, setStructuredRequest] = useState(null);
  const [csmLoading, setCsmLoading] = useState(false);
  const [pmLoading, setPmLoading] = useState(false);
  const [engLoading, setEngLoading] = useState(false);
  const [featureQueue, setFeatureQueue] = useState([]);

  /**
   * Handle CSM (Customer Success Manager) messages
   */
  const handleCsmMessage = async (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setCsmMessages(prev => [...prev, newMessage]);
    setCsmLoading(true);

    // Add agent activity
    setActivities(prev => [...prev, {
      type: 'working',
      agent: 'Request Intake Agent',
      message: 'Processing customer request and searching for similar cases...',
      timestamp: new Date().toISOString()
    }]);

    try {
      // Call the intake agent API
      const conversationHistory = csmMessages.filter(msg => msg.role === 'user' || msg.role === 'assistant');

      const response = await fetch('http://localhost:3001/api/agents/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // Add agent response to messages
      const agentMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };
      setCsmMessages(prev => [...prev, agentMessage]);

      // Store the structured request
      if (data.structuredRequest) {
        setStructuredRequest(data.structuredRequest);
        console.log('Structured Request:', data.structuredRequest);
        console.log('Request Summary:', data.requestSummary);
      }

      // Add completion activity
      setActivities(prev => [...prev, {
        type: 'complete',
        agent: 'Request Intake Agent',
        message: `Response generated (Completeness: ${data.structuredRequest?.meta?.completeness || 0}%)`,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('Error calling intake agent:', error);

      // Provide user-friendly error message
      let errorMessage = 'Failed to process request. ';
      if (error.message.includes('fetch')) {
        errorMessage += 'Cannot connect to server. Please make sure the backend is running.';
      } else {
        errorMessage += error.message;
      }

      const errorMsg = {
        role: 'assistant',
        content: `⚠️ ${errorMessage}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setCsmMessages(prev => [...prev, errorMsg]);

      setActivities(prev => [...prev, {
        type: 'error',
        agent: 'Request Intake Agent',
        message: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setCsmLoading(false);
    }
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
   * Add current structured request to PM queue
   */
  const addToQueue = () => {
    if (!structuredRequest) {
      console.warn('No structured request to add to queue');
      return;
    }

    // Add unique ID and submission timestamp
    const queueItem = {
      ...structuredRequest,
      queueId: `queue-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      submittedBy: 'CSM'
    };

    setFeatureQueue(prev => [...prev, queueItem]);

    // Add activity
    setActivities(prev => [...prev, {
      type: 'queue',
      agent: 'Request Intake Agent',
      message: `Added "${structuredRequest.request.title || 'feature request'}" to PM queue (${structuredRequest.customer.companyName})`,
      timestamp: new Date().toISOString()
    }]);

    // Reset structured request for next intake
    setStructuredRequest(null);

    return queueItem;
  };

  /**
   * Reset all workflow state
   */
  const resetWorkflow = () => {
    setCsmMessages([]);
    setPmMessages([]);
    setEngMessages([]);
    setActivities([]);
    setStructuredRequest(null);
    setFeatureQueue([]);
    setCsmLoading(false);
    setPmLoading(false);
    setEngLoading(false);
    setStartTime(Date.now());
  };

  return {
    // State
    startTime,
    csmMessages,
    pmMessages,
    engMessages,
    activities,
    structuredRequest,
    featureQueue,
    csmLoading,
    pmLoading,
    engLoading,

    // Handlers
    handleCsmMessage,
    handlePmMessage,
    handleEngMessage,

    // Actions
    addToQueue,
    resetWorkflow
  };
}

export default useWorkflowState;
