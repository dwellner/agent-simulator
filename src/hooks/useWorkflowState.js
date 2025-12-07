import { useState } from 'react';
import { retryWithBackoff, isRetryableError, getUserFriendlyErrorMessage } from '../utils/apiUtils.js';

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
  const [customerInsights, setCustomerInsights] = useState([]);
  const [availableTechSpec, setAvailableTechSpec] = useState(null);
  const [sharedTechSpecs, setSharedTechSpecs] = useState([]);

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
      // Call the intake agent API with retry logic
      const conversationHistory = csmMessages.filter(msg => msg.role === 'user' || msg.role === 'assistant');

      const data = await retryWithBackoff(async () => {
        const response = await fetch('/api/agents/intake', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for session
          body: JSON.stringify({
            message,
            conversationHistory
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        return await response.json();
      }, {
        maxRetries: 2,
        shouldRetry: isRetryableError
      });

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

      // Get user-friendly error message
      const errorMessage = getUserFriendlyErrorMessage(error, 'Request Intake Agent');

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
        message: `Error: ${error.message || 'Unknown error'}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setCsmLoading(false);
    }
  };

  /**
   * Handle PM (Product Manager) messages
   */
  const handlePmMessage = async (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setPmMessages(prev => [...prev, newMessage]);
    setPmLoading(true);

    // Add agent activity
    setActivities(prev => [...prev, {
      type: 'analysis',
      agent: 'Customer Insights Agent',
      message: 'Analyzing customer insights and identifying patterns...',
      timestamp: new Date().toISOString()
    }]);

    try {
      // Call the insights agent API with retry logic
      const conversationHistory = pmMessages.filter(msg => msg.role === 'user' || msg.role === 'assistant');

      const data = await retryWithBackoff(async () => {
        const response = await fetch('/api/agents/insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for session
          body: JSON.stringify({
            message,
            conversationHistory
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        return await response.json();
      }, {
        maxRetries: 2,
        shouldRetry: isRetryableError
      });

      // Add agent response to messages
      const agentMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };
      setPmMessages(prev => [...prev, agentMessage]);

      // Add completion activity
      setActivities(prev => [...prev, {
        type: 'complete',
        agent: 'Customer Insights Agent',
        message: `Analysis complete (${data.insightsContext?.totalInsights || 0} insights analyzed)`,
        timestamp: new Date().toISOString()
      }]);

      // Check if technical analysis was triggered
      if (data.techAnalysisTriggered && data.techAnalysisResult) {
        console.log('🎯 Tech analysis triggered:', data.techAnalysisResult);

        // Store the available tech spec for sharing
        setAvailableTechSpec({
          featureTitle: data.techAnalysisResult.featureTitle,
          timestamp: data.techAnalysisResult.timestamp
        });

        // Add activity showing technical analysis was initiated
        setActivities(prev => [...prev, {
          type: 'working',
          agent: 'Technical Specification Agent',
          message: `Autonomous analysis initiated for: ${data.techAnalysisResult.featureTitle}`,
          timestamp: new Date().toISOString()
        }]);

        // Add activity showing technical analysis completion
        setTimeout(() => {
          setActivities(prev => [...prev, {
            type: 'complete',
            agent: 'Technical Specification Agent',
            message: `Technical specification complete for: ${data.techAnalysisResult.featureTitle}`,
            timestamp: new Date().toISOString()
          }]);
        }, 500);
      }

    } catch (error) {
      console.error('Error calling insights agent:', error);

      // Get user-friendly error message
      const errorMessage = getUserFriendlyErrorMessage(error, 'Customer Insights Agent');

      const errorMsg = {
        role: 'assistant',
        content: `⚠️ ${errorMessage}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setPmMessages(prev => [...prev, errorMsg]);

      setActivities(prev => [...prev, {
        type: 'error',
        agent: 'Customer Insights Agent',
        message: `Error: ${error.message || 'Unknown error'}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setPmLoading(false);
    }
  };

  /**
   * Handle Engineering Lead messages
   */
  const handleEngMessage = async (message) => {
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setEngMessages(prev => [...prev, newMessage]);
    setEngLoading(true);

    // Add agent activity
    setActivities(prev => [...prev, {
      type: 'working',
      agent: 'Technical Specification Agent',
      message: 'Reviewing codebase architecture and past implementations...',
      timestamp: new Date().toISOString()
    }]);

    try {
      // Call the tech spec agent API with retry logic
      const conversationHistory = engMessages.filter(msg => msg.role === 'user' || msg.role === 'assistant');

      const data = await retryWithBackoff(async () => {
        const response = await fetch('/api/agents/techspec', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for session
          body: JSON.stringify({
            message,
            conversationHistory,
            mode: 'conversational' // Default to conversational mode
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        return await response.json();
      }, {
        maxRetries: 2,
        shouldRetry: isRetryableError
      });

      // Add agent response to messages
      const agentMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };
      setEngMessages(prev => [...prev, agentMessage]);

      // Add completion activity
      setActivities(prev => [...prev, {
        type: 'complete',
        agent: 'Technical Specification Agent',
        message: `Technical analysis complete (${data.codebaseContext.componentsCount} components reviewed)`,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('Error calling tech spec agent:', error);

      // Get user-friendly error message
      const errorMessage = getUserFriendlyErrorMessage(error, 'Technical Specification Agent');

      const errorMsg = {
        role: 'assistant',
        content: `⚠️ ${errorMessage}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setEngMessages(prev => [...prev, errorMsg]);

      setActivities(prev => [...prev, {
        type: 'error',
        agent: 'Technical Specification Agent',
        message: `Error: ${error.message || 'Unknown error'}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setEngLoading(false);
    }
  };

  /**
   * Share technical specification with Engineering Lead
   */
  const shareTechSpec = () => {
    if (!availableTechSpec) {
      console.warn('No tech spec available to share');
      return;
    }

    // Add to shared specs list
    const sharedSpec = {
      ...availableTechSpec,
      sharedAt: new Date().toISOString()
    };
    setSharedTechSpecs(prev => [...prev, sharedSpec]);

    // Add system message to Engineering window
    const systemMessage = {
      role: 'system',
      content: `📋 New Technical Specification Shared\n\nFeature: ${availableTechSpec.featureTitle}\nAnalysis completed at: ${new Date(availableTechSpec.timestamp).toLocaleString()}\n\nThe Product Manager has shared a technical specification for review. You can ask the Technical Specification Agent about implementation details, risks, and next steps.`,
      timestamp: new Date().toISOString(),
      isSystemMessage: true
    };
    setEngMessages(prev => [...prev, systemMessage]);

    // Add activity
    setActivities(prev => [...prev, {
      type: 'handoff',
      agent: 'Customer Insights Agent',
      message: `Shared technical specification with Engineering: "${availableTechSpec.featureTitle}"`,
      timestamp: new Date().toISOString()
    }]);

    // Clear available spec
    setAvailableTechSpec(null);

    console.log('✓ Tech spec shared with Engineering:', sharedSpec);
  };

  /**
   * Submit current structured request as customer insight to PM
   */
  const submitInsight = async () => {
    if (!structuredRequest) {
      console.warn('No structured request to submit as insight');
      return;
    }

    // Add unique ID and submission timestamp
    const insight = {
      ...structuredRequest,
      insightId: `insight-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      submittedBy: 'CSM'
    };

    try {
      // POST insight to backend
      const response = await fetch('/api/insights/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: Include cookies for session
        body: JSON.stringify({ insight })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✓ Insight submitted to backend:', data);

      // Also keep in client state for immediate UI updates
      setCustomerInsights(prev => [...prev, insight]);

      // Add activity
      setActivities(prev => [...prev, {
        type: 'insight',
        agent: 'Request Intake Agent',
        message: `Submitted insight: "${structuredRequest.request.title || 'customer request'}" from ${structuredRequest.customer.companyName}`,
        timestamp: new Date().toISOString()
      }]);

      // Reset structured request for next intake
      setStructuredRequest(null);

      return insight;

    } catch (error) {
      console.error('Error submitting insight to backend:', error);

      // Add error activity
      setActivities(prev => [...prev, {
        type: 'error',
        agent: 'System',
        message: `Failed to submit insight: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);

      throw error;
    }
  };

  /**
   * Reset all workflow state (both frontend and backend session)
   */
  const resetWorkflow = async () => {
    try {
      // Clear backend session data first
      const response = await fetch('/api/insights/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
      });

      if (!response.ok) {
        console.error('Failed to reset backend session:', await response.text());
        // Continue with frontend reset even if backend fails
      }
    } catch (error) {
      console.error('Error resetting backend session:', error);
      // Continue with frontend reset even if backend fails
    }

    // Reset all frontend state
    setCsmMessages([]);
    setPmMessages([]);
    setEngMessages([]);
    setActivities([]);
    setStructuredRequest(null);
    setCustomerInsights([]);
    setAvailableTechSpec(null);
    setSharedTechSpecs([]);
    setCsmLoading(false);
    setPmLoading(false);
    setEngLoading(false);
    setStartTime(Date.now());

    console.log('✓ Demo reset complete');
  };

  return {
    // State
    startTime,
    csmMessages,
    pmMessages,
    engMessages,
    activities,
    structuredRequest,
    customerInsights,
    csmLoading,
    pmLoading,
    engLoading,
    availableTechSpec,
    sharedTechSpecs,

    // Handlers
    handleCsmMessage,
    handlePmMessage,
    handleEngMessage,

    // Actions
    submitInsight,
    shareTechSpec,
    resetWorkflow
  };
}

export default useWorkflowState;
