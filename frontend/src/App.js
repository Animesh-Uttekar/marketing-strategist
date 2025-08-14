import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ResultsDashboard from './components/ResultsDashboard';
import LoadingOverlay from './components/LoadingOverlay';
import WelcomeWizard from './components/WelcomeWizard';
import ProgressTracker from './components/ProgressTracker';
import NotificationToast from './components/NotificationToast';

// Enhanced UX with multi-step workflow and better state management
function App() {
  // Core state
  const [simulationData, setSimulationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Enhanced UX state
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, input, results
  const [showWelcome, setShowWelcome] = useState(true);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [userPreferences, setUserPreferences] = useState({
    preferredAI: 'openai',
    autoSave: true,
    theme: 'light'
  });

  // Load user preferences and history from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('marketingStrategist_preferences');
    const savedHistory = localStorage.getItem('marketingStrategist_history');
    const hasSeenWelcome = localStorage.getItem('marketingStrategist_welcomeSeen');
    
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    }
    
    if (savedHistory) {
      setSimulationHistory(JSON.parse(savedHistory));
    }
    
    if (hasSeenWelcome) {
      setShowWelcome(false);
      setCurrentStep('input');
    }
  }, []);

  // Save to localStorage when preferences or history change
  useEffect(() => {
    localStorage.setItem('marketingStrategist_preferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  useEffect(() => {
    if (simulationHistory.length > 0) {
      localStorage.setItem('marketingStrategist_history', JSON.stringify(simulationHistory));
    }
  }, [simulationHistory]);

  // Enhanced notification system
  const showNotification = useCallback((message, type = 'info', duration = 4000) => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), duration);
  }, []);

  // Enhanced simulation handler with better error handling and user feedback
  const handleSimulation = async (inputData) => {
    setIsLoading(true);
    setError(null);
    setCurrentStep('loading');
    
    // Add user preferences to request
    const enhancedInputData = {
      ...inputData,
      use_hugging_face: userPreferences.preferredAI === 'huggingface'
    };
    
    try {
      showNotification('Running AI-powered marketing analysis...', 'info');
      
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/simulate' 
        : 'http://localhost:8000/simulate';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedInputData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Enhanced data processing
      const enhancedData = {
        ...data,
        timestamp: new Date().toISOString(),
        inputData: enhancedInputData,
        aiModel: userPreferences.preferredAI
      };
      
      setSimulationData(enhancedData);
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        timestamp: enhancedData.timestamp,
        companyDescription: inputData.company_description.substring(0, 50) + '...',
        roiScore: enhancedData.roi_fit_score,
        marketFit: enhancedData.roi_fit_tag
      };
      
      setSimulationHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // Keep last 10
      setCurrentStep('results');
      
      showNotification('Analysis complete! Check your results below.', 'success');
      
    } catch (err) {
      console.error('Simulation error:', err);
      setError(err.message);
      setCurrentStep('input');
      showNotification(`Analysis failed: ${err.message}`, 'error', 6000);
    } finally {
      setIsLoading(false);
    }
  };

  // Welcome wizard completion
  const handleWelcomeComplete = (preferences) => {
    setUserPreferences(prev => ({ ...prev, ...preferences }));
    setShowWelcome(false);
    setCurrentStep('input');
    localStorage.setItem('marketingStrategist_welcomeSeen', 'true');
    showNotification('Welcome to Marketing Strategist! Ready to analyze your campaigns.', 'success');
  };

  // Step navigation
  const handleStepChange = (stepIndex) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  // Reset to new analysis
  const handleNewAnalysis = () => {
    setCurrentStep(0);
    setIsLoading(false);
    setSimulationData(null);
    setError(null);
    showNotification('Starting new analysis...', 'info');
  };

  // Progress steps for the tracker
  const progressSteps = [
    { id: 'input', label: 'Campaign Details', completed: simulationData !== null },
    { id: 'analysis', label: 'AI Analysis', completed: simulationData !== null },
    { id: 'results', label: 'Results & Insights', completed: simulationData !== null }
  ];

  return (
    <div className={`App theme-${userPreferences.theme}`}>
      <Header 
        onNewAnalysis={handleNewAnalysis}
        simulationHistory={simulationHistory}
        userPreferences={userPreferences}
        onPreferencesChange={setUserPreferences}
      />
      
      {/* Progress Tracker */}
      {!showWelcome && (
        <ProgressTracker 
          steps={progressSteps}
          currentStep={currentStep}
          onStepClick={handleStepChange}
        />
      )}
      
      <main className="main-content">
        {/* Welcome Wizard */}
        {showWelcome && (
          <WelcomeWizard onComplete={handleWelcomeComplete} />
        )}
        
        {/* Main Dashboard */}
        {!showWelcome && (
          <div className="dashboard-container">
            <div className={`content-section ${currentStep === 'input' ? 'active' : ''}`}>
              <InputPanel 
                onSimulate={handleSimulation} 
                isLoading={isLoading} 
                error={error}
                userPreferences={userPreferences}
                simulationHistory={simulationHistory}
              />
            </div>
            
            <div className={`content-section ${currentStep === 'results' ? 'active' : ''}`}>
              <ResultsDashboard 
                data={simulationData}
                onNewAnalysis={handleNewAnalysis}
                userPreferences={userPreferences}
              />
            </div>
          </div>
        )}
      </main>
      
      {/* Loading Overlay with enhanced animations */}
      {isLoading && (
        <LoadingOverlay 
          message="Analyzing your marketing campaign with AI..."
          progress={true}
        />
      )}
      
      {/* Notification Toast */}
      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;
