import React from 'react';
import { Zap, Shield, Users, Clock, CheckCircle } from 'lucide-react';

const TrustBar = ({ darkMode }) => {
  const indicators = [
    { icon: Shield, text: "100% Client-Side", color: "#10b981" },
    { icon: Zap, text: "Sub-second Processing", color: "#f59e0b" },
    { icon: Users, text: "50K+ Monthly Users", color: "#3b82f6" },
    { icon: Clock, text: "99.9% Uptime", color: "#8b5cf6" },
    { icon: CheckCircle, text: "Zero Data Collection", color: "#ef4444" }
  ];

  return (
    <div style={{
      backgroundColor: darkMode ? '#1f2937' : '#f8fafc',
      borderBottom: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '24px'
    }}>
      {indicators.map((indicator, index) => {
        const Icon = indicator.icon;
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: darkMode ? '#e5e7eb' : '#64748b'
            }}
          >
            <Icon size={16} style={{ color: indicator.color }} />
            <span>{indicator.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TrustBar;