import React, { useState } from 'react';
import { Play, AlertCircle, Lightbulb } from 'lucide-react';
import { Button, TextArea, Card, Badge } from './shared';

const InputPanel = ({ onSimulate, isLoading, error }) => {
  const [formData, setFormData] = useState({
    company_description: '',
    advertisement_goal: ''
  });

  const [charCount, setCharCount] = useState({
    company_description: 0,
    advertisement_goal: 0
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setCharCount(prev => ({
      ...prev,
      [field]: value.length
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.company_description.trim() && formData.advertisement_goal.trim()) {
      onSimulate(formData);
    }
  };

  const isFormValid = formData.company_description.trim() && formData.advertisement_goal.trim();

  const exampleGoals = [
    'Increase brand awareness',
    'Drive website traffic',
    'Generate leads',
    'Boost product sales',
    'Improve customer engagement',
    'Launch new product'
  ];

  return (
    <Card 
      title="Campaign Simulation Studio"
      subtitle="Configure your marketing campaign parameters for AI-powered analysis"
      className="input-panel-card"
    >
      <form onSubmit={handleSubmit}>
        <TextArea
          label={`Company Description * (${charCount.company_description}/500)`}
          placeholder="Describe your company, industry, target audience, and key value propositions. Be specific about your business model and market positioning..."
          value={formData.company_description}
          onChange={(e) => handleInputChange('company_description', e.target.value)}
          maxLength={500}
          rows={4}
          required
        />
        <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
          <Lightbulb size={14} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            Include industry, target demographics, and unique selling points
          </span>
        </div>

        <TextArea
          label={`Advertisement Goal * (${charCount.advertisement_goal}/200)`}
          placeholder="What specific outcome do you want to achieve with this campaign? Be clear about your primary objective..."
          value={formData.advertisement_goal}
          onChange={(e) => handleInputChange('advertisement_goal', e.target.value)}
          maxLength={200}
          rows={3}
          required
        />
        <div style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
          <p className="text-xs text-gray-500 mb-2">Popular goals:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {exampleGoals.map((goal, index) => (
              <Badge
                key={index}
                variant="default"
                className="goal-badge"
                onClick={() => handleInputChange('advertisement_goal', goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </div>

        {error && (
          <div className="error-message" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#dc2626',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        <Button
          type="submit"
          disabled={!isFormValid}
          loading={isLoading}
          icon={!isLoading ? <Play size={16} /> : null}
          className="w-full"
        >
          {isLoading ? 'Analyzing Campaign...' : 'Run Simulation'}
        </Button>
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <h4 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            color: '#374151',
            margin: '0 0 0.5rem 0'
          }}>
            How it works:
          </h4>
          <ul style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280', 
            margin: 0,
            paddingLeft: '1rem'
          }}>
            <li>AI extracts campaign metrics from your inputs</li>
            <li>Monte Carlo simulation runs 10,000 impressions</li>
            <li>Analyzes user journey through marketing funnel</li>
            <li>Provides ROI scoring and optimization recommendations</li>
          </ul>
        </div>
      </form>
    </Card>
  );
};

export default InputPanel;
