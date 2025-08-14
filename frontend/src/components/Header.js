import React, { useState } from 'react';
import { Target, Plus, History, Settings, ChevronDown, Brain, Zap } from 'lucide-react';
import { Button } from './shared';

const Header = ({ onNewAnalysis, simulationHistory = [], userPreferences, onPreferencesChange }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAIModelIcon = () => {
    return userPreferences?.preferredAI === 'huggingface' ? <Brain size={16} /> : <Zap size={16} />;
  };

  const getAIModelName = () => {
    return userPreferences?.preferredAI === 'huggingface' ? 'Hugging Face' : 'OpenAI GPT';
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-icon">
            <Target size={24} />
          </div>
          <div className="brand-content">
            <h1 className="brand-title">Marketing Strategist</h1>
            <p className="brand-subtitle">AI-Powered Campaign Analysis</p>
          </div>
        </div>
        
        <div className="header-actions">
          {/* AI Model Indicator */}
          <div className="ai-indicator">
            {getAIModelIcon()}
            <span>{getAIModelName()}</span>
          </div>
          
          {/* History Dropdown */}
          <div className="dropdown-container">
            <button 
              className="header-btn dropdown-trigger"
              onClick={() => setShowHistory(!showHistory)}
              disabled={simulationHistory.length === 0}
            >
              <History size={16} />
              <span>History</span>
              <ChevronDown size={14} />
            </button>
            
            {showHistory && simulationHistory.length > 0 && (
              <div className="dropdown-menu history-dropdown">
                <div className="dropdown-header">
                  <h3>Recent Analyses</h3>
                </div>
                <div className="history-list">
                  {simulationHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-content">
                        <div className="history-title">{item.companyDescription}</div>
                        <div className="history-meta">
                          <span className="history-date">{formatDate(item.timestamp)}</span>
                          <span className={`history-score ${item.marketFit.toLowerCase().replace(' ', '-')}`}>
                            {item.roiScore}% ROI
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {simulationHistory.length > 5 && (
                  <div className="dropdown-footer">
                    <span>{simulationHistory.length - 5} more analyses...</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Settings Dropdown */}
          <div className="dropdown-container">
            <button 
              className="header-btn dropdown-trigger"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={16} />
              <span>Settings</span>
              <ChevronDown size={14} />
            </button>
            
            {showSettings && (
              <div className="dropdown-menu settings-dropdown">
                <div className="dropdown-header">
                  <h3>Preferences</h3>
                </div>
                <div className="settings-content">
                  <div className="setting-group">
                    <label>AI Model</label>
                    <select 
                      value={userPreferences?.preferredAI || 'openai'}
                      onChange={(e) => onPreferencesChange(prev => ({ 
                        ...prev, 
                        preferredAI: e.target.value 
                      }))}
                      className="setting-select"
                    >
                      <option value="openai">OpenAI GPT-3.5</option>
                      <option value="huggingface">Hugging Face OSS</option>
                    </select>
                  </div>
                  
                  <div className="setting-group">
                    <label>Theme</label>
                    <select 
                      value={userPreferences?.theme || 'light'}
                      onChange={(e) => onPreferencesChange(prev => ({ 
                        ...prev, 
                        theme: e.target.value 
                      }))}
                      className="setting-select"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  
                  <div className="setting-group">
                    <label className="checkbox-setting">
                      <input
                        type="checkbox"
                        checked={userPreferences?.autoSave || false}
                        onChange={(e) => onPreferencesChange(prev => ({ 
                          ...prev, 
                          autoSave: e.target.checked 
                        }))}
                      />
                      <span>Auto-save analyses</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* New Analysis Button */}
          <Button 
            variant="primary"
            size="small"
            onClick={onNewAnalysis}
            icon={<Plus size={16} />}
            className="header-btn-primary"
          >
            New Analysis
          </Button>
        </div>
      </div>
      
      {/* Click outside to close dropdowns */}
      {(showHistory || showSettings) && (
        <div 
          className="dropdown-overlay"
          onClick={() => {
            setShowHistory(false);
            setShowSettings(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
