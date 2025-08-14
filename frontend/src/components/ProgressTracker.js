import React from 'react';
import { Check, Circle, ArrowRight } from 'lucide-react';
import { Badge } from './shared';

const ProgressTracker = ({ steps, currentStep, onStepClick }) => {
  const getStepStatus = (step, index) => {
    if (step.completed) return 'completed';
    if (step.id === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (step, index) => {
    if (step.completed) {
      return <Check size={16} />;
    }
    if (step.id === currentStep) {
      return <Circle size={16} className="pulse" />;
    }
    return <span className="step-number">{index + 1}</span>;
  };

  return (
    <div className="progress-tracker">
      <div className="progress-container">
        <div className="progress-steps">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div 
                className={`progress-step ${getStepStatus(step, index)}`}
                onClick={() => step.completed && onStepClick(step.id)}
                role={step.completed ? "button" : "presentation"}
                tabIndex={step.completed ? 0 : -1}
              >
                <div className="step-icon">
                  {getStepIcon(step, index)}
                </div>
                <div className="step-content">
                  <div className="step-label">{step.label}</div>
                  <Badge 
                    variant={step.completed ? 'success' : step.id === currentStep ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    {step.completed ? 'Completed' : 
                     step.id === currentStep ? 'In Progress' : 'Pending'}
                  </Badge>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`progress-connector ${step.completed ? 'completed' : ''}`}>
                  <ArrowRight size={16} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
