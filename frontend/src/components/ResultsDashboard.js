import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MousePointer, Eye, ShoppingCart, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { Card } from './shared';

const ResultsDashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('funnel');

  if (!data) {
    return (
      <Card className="results-empty-state">
        <div className="empty-state-content">
          <div className="empty-state-icon">
            <BarChart size={48} />
          </div>
          <h3 className="empty-state-title">
            Ready for Analysis
          </h3>
          <p className="empty-state-description">
            Configure your campaign parameters and run a simulation to see detailed performance analytics and AI-powered insights.
          </p>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'funnel', label: 'Funnel Analysis', icon: TrendingUp },
    { id: 'roi', label: 'ROI Metrics', icon: Target },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb }
  ];

  const funnelData = [
    { 
      stage: 'Impressions', 
      count: data.user_journey_stats.total_impressions, 
      rate: 100,
      icon: Eye,
      color: '#3b82f6'
    },
    { 
      stage: 'Clicks', 
      count: data.user_journey_stats.total_clicks, 
      rate: ((data.user_journey_stats.total_clicks / data.user_journey_stats.total_impressions) * 100).toFixed(2),
      icon: MousePointer,
      color: '#10b981'
    },
    { 
      stage: 'Landings', 
      count: data.user_journey_stats.total_landings, 
      rate: ((data.user_journey_stats.total_landings / data.user_journey_stats.total_impressions) * 100).toFixed(2),
      icon: Users,
      color: '#f59e0b'
    },
    { 
      stage: 'Engagements', 
      count: data.user_journey_stats.total_engagements, 
      rate: ((data.user_journey_stats.total_engagements / data.user_journey_stats.total_impressions) * 100).toFixed(2),
      icon: TrendingUp,
      color: '#8b5cf6'
    },
    { 
      stage: 'Conversions', 
      count: data.user_journey_stats.total_conversions, 
      rate: ((data.user_journey_stats.total_conversions / data.user_journey_stats.total_impressions) * 100).toFixed(2),
      icon: ShoppingCart,
      color: '#ef4444'
    }
  ];

  const pieData = [
    { name: 'Converted', value: data.user_journey_stats.total_conversions, color: '#10b981' },
    { name: 'Engaged (No Conversion)', value: data.user_journey_stats.total_engagements - data.user_journey_stats.total_conversions, color: '#f59e0b' },
    { name: 'Clicked (No Engagement)', value: data.user_journey_stats.total_clicks - data.user_journey_stats.total_engagements, color: '#6b7280' },
    { name: 'Impressions Only', value: data.user_journey_stats.total_impressions - data.user_journey_stats.total_clicks, color: '#e5e7eb' }
  ];

  const renderFunnelTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {funnelData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.stage} style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: item.color
              }} />
              <div style={{
                background: `${item.color}20`,
                borderRadius: '50%',
                padding: '0.75rem',
                display: 'inline-flex',
                marginBottom: '1rem'
              }}>
                <Icon size={24} style={{ color: item.color }} />
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#1f2937',
                margin: '0 0 0.25rem 0'
              }}>
                {item.count.toLocaleString()}
              </h3>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                margin: '0 0 0.5rem 0'
              }}>
                {item.stage}
              </p>
              <div style={{
                background: '#f3f4f6',
                borderRadius: '12px',
                padding: '0.25rem 0.75rem',
                display: 'inline-block'
              }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  color: item.color
                }}>
                  {item.rate}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '1rem'
          }}>
            Funnel Performance
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '1rem'
          }}>
            User Distribution
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderROITab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{
          background: data.roi_fit_tag === 'High market fit' ? '#dcfce7' : '#fee2e2',
          border: `1px solid ${data.roi_fit_tag === 'High market fit' ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: data.roi_fit_tag === 'High market fit' ? '#166534' : '#dc2626',
            marginBottom: '0.5rem'
          }}>
            {data.roi_fit_score}%
          </div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#374151',
            margin: '0 0 0.5rem 0'
          }}>
            ROI Fit Score
          </h3>
          <div className={`badge ${data.roi_fit_tag === 'High market fit' ? 'badge-success' : 'badge-danger'}`}>
            {data.roi_fit_tag}
          </div>
        </div>

        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem'
        }}>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '1.5rem'
          }}>
            Key Performance Metrics
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click-through Rate</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                {((data.user_journey_stats.total_clicks / data.user_journey_stats.total_impressions) * 100).toFixed(2)}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Engagement Rate</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                {((data.user_journey_stats.total_engagements / data.user_journey_stats.total_clicks) * 100).toFixed(2)}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Conversion Rate</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                {((data.user_journey_stats.total_conversions / data.user_journey_stats.total_engagements) * 100).toFixed(2)}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '600' }}>Overall Journey Rate</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e40af' }}>
                {((data.user_journey_stats.total_conversions / data.user_journey_stats.total_impressions) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          background: '#ddd6fe',
          borderRadius: '50%',
          padding: '0.5rem'
        }}>
          <Lightbulb size={20} style={{ color: '#7c3aed' }} />
        </div>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#374151',
          margin: 0
        }}>
          AI-Generated Insights
        </h3>
      </div>
      
      {data.recommendations && data.recommendations.length > 0 ? (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.5rem',
          lineHeight: '1.6'
        }}>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', color: '#374151' }}>
            {data.recommendations[0]}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <AlertTriangle size={20} style={{ color: '#d97706' }} />
          <span style={{ fontSize: '0.875rem', color: '#92400e' }}>
            No AI insights available for this simulation.
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Campaign Performance Analysis</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: activeTab === tab.id ? '#1e40af' : 'white',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="card-content">
        {activeTab === 'funnel' && renderFunnelTab()}
        {activeTab === 'roi' && renderROITab()}
        {activeTab === 'insights' && renderInsightsTab()}
      </div>
    </div>
  );
};

export default ResultsDashboard;
