import React from 'react';
import { Brain, Zap, BarChart3 } from 'lucide-react';

const LoadingOverlay = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '400px',
        margin: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#ddd6fe',
            borderRadius: '50%',
            padding: '1rem',
            animation: 'bounce 1s infinite'
          }}>
            <Brain size={24} style={{ color: '#7c3aed' }} />
          </div>
          <div style={{
            background: '#fef3c7',
            borderRadius: '50%',
            padding: '1rem',
            animation: 'bounce 1s infinite 0.2s'
          }}>
            <Zap size={24} style={{ color: '#d97706' }} />
          </div>
          <div style={{
            background: '#dbeafe',
            borderRadius: '50%',
            padding: '1rem',
            animation: 'bounce 1s infinite 0.4s'
          }}>
            <BarChart3 size={24} style={{ color: '#2563eb' }} />
          </div>
        </div>
        
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 1rem 0'
        }}>
          Running AI Simulation
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
            <span>Analyzing campaign parameters with GPT...</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
            <span>Running Monte Carlo simulation (10,000 impressions)...</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
            <span>Generating optimization insights...</span>
          </div>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: '#64748b',
          lineHeight: '1.4'
        }}>
          This process typically takes 10-30 seconds depending on the complexity of your campaign parameters.
        </div>
      </div>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-8px,0);
          }
          70% {
            transform: translate3d(0,-4px,0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
