import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Target, BarChart3, Brain, Zap, User, Building, TrendingUp, Sparkles } from 'lucide-react';
import { Button, Select, Badge } from './shared';

const WelcomeWizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    preferredAI: 'openai',
    experience: 'beginner',
    industry: '',
    goals: []
  });

  const steps = [
    {
      title: 'Welcome to Marketing Strategist',
      subtitle: 'AI-powered marketing campaign analysis',
      content: (
        <div className="welcome-intro">
          <div className="feature-grid">
            <div className="feature-card">
              <Brain className="feature-icon" />
              <h3>AI Analysis</h3>
              <p>Get insights from OpenAI and Hugging Face models</p>
            </div>
            <div className="feature-card">
              <TrendingUp className="feature-icon" />
              <h3>ROI Optimization</h3>
              <p>Identify bottlenecks and improve campaign performance</p>
            </div>
            <div className="feature-card">
              <Sparkles className="feature-icon" />
              <h3>Smart Recommendations</h3>
              <p>Actionable suggestions based on your data</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Choose Your AI Model',
      subtitle: 'Select your preferred analysis engine',
      content: (
        <div className="ai-selection">
          <div className="ai-options">
            <div 
              className={`ai-option ${preferences.preferredAI === 'openai' ? 'selected' : ''}`}
              onClick={() => setPreferences(prev => ({ ...prev, preferredAI: 'openai' }))}
            >
              <div className="ai-header">
                <h3>OpenAI GPT-3.5</h3>
                <span className="badge recommended">Recommended</span>
              </div>
              <p>Fast, reliable, and proven for marketing analysis</p>
              <ul>
                <li>✓ Faster response times</li>
                <li>✓ Consistent quality</li>
                <li>✓ Industry-tested</li>
              </ul>
            </div>
            
            <div 
              className={`ai-option ${preferences.preferredAI === 'huggingface' ? 'selected' : ''}`}
              onClick={() => setPreferences(prev => ({ ...prev, preferredAI: 'huggingface' }))}
            >
              <div className="ai-header">
                <h3>Hugging Face OSS</h3>
                <span className="badge experimental">Experimental</span>
              </div>
              <p>Open-source alternative with unique insights</p>
              <ul>
                <li>✓ Open-source model</li>
                <li>✓ Privacy-focused</li>
                <li>✓ Alternative perspectives</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Tell Us About You',
      subtitle: 'Help us personalize your experience',
      content: (
        <div className="user-profile">
          <div className="form-group">
            <label>Experience Level</label>
            <div className="radio-group">
              {['beginner', 'intermediate', 'expert'].map(level => (
                <label key={level} className="radio-option">
                  <input
                    type="radio"
                    name="experience"
                    value={level}
                    checked={preferences.experience === level}
                    onChange={(e) => setPreferences(prev => ({ ...prev, experience: e.target.value }))}
                  />
                  <span className="radio-label">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Primary Industry</label>
            <select 
              value={preferences.industry}
              onChange={(e) => setPreferences(prev => ({ ...prev, industry: e.target.value }))}
              className="select-input"
            >
              <option value="">Select your industry</option>
              <option value="saas">SaaS & Technology</option>
              <option value="ecommerce">E-commerce & Retail</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance & Banking</option>
              <option value="education">Education</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Main Goals (select all that apply)</label>
            <div className="checkbox-group">
              {[
                'Increase conversions',
                'Reduce acquisition costs',
                'Improve ROI',
                'Optimize funnel',
                'A/B test campaigns',
                'Understand audience'
              ].map(goal => (
                <label key={goal} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={preferences.goals.includes(goal)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPreferences(prev => ({ 
                          ...prev, 
                          goals: [...prev.goals, goal] 
                        }));
                      } else {
                        setPreferences(prev => ({ 
                          ...prev, 
                          goals: prev.goals.filter(g => g !== goal) 
                        }));
                      }
                    }}
                  />
                  <span className="checkbox-label">{goal}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(preferences);
  };

  return (
    <div className="welcome-wizard">
      <div className="wizard-container">
        <div className="wizard-header">
          <div className="step-indicator">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`step-dot ${index <= currentStep ? 'active' : ''}`}
              />
            ))}
          </div>
          <h1>{steps[currentStep].title}</h1>
          <p>{steps[currentStep].subtitle}</p>
        </div>
        
        <div className="wizard-content">
          {steps[currentStep].content}
        </div>
        
        <div className="wizard-footer">
          <Button 
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            icon={<ChevronLeft size={16} />}
          >
            Previous
          </Button>
          
          <Button 
            variant="primary"
            onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
            icon={<ChevronRight size={16} />}
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeWizard;
