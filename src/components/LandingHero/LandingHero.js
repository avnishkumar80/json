import React from 'react';
import { 
  FileText, 
  Zap, 
  Shield, 
  Globe, 
  Code, 
  CheckCircle, 
  Star, 
  Users,
  ArrowRight,
  Github,
  Twitter
} from 'lucide-react';

const LandingHero = ({ darkMode, onGetStarted }) => {
  return (
    <div style={{
      background: darkMode 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      padding: '80px 20px',
      textAlign: 'center',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <Star size={16} style={{ marginRight: '8px' }} />
          Trusted by 10,000+ developers worldwide
        </div>
        
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          marginBottom: '24px',
          lineHeight: '1.2'
        }}>
          The Developer's Choice for
          <br />
          <span style={{ 
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            JSON Formatting
          </span>
        </h1>
        
        <p style={{
          fontSize: '20px',
          marginBottom: '32px',
          opacity: 0.9,
          lineHeight: '1.6'
        }}>
          Fast, secure, and powerful JSON tools. Format, validate, and debug JSON 
          in seconds with our advanced editor trusted by developers at top companies.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onGetStarted}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              backgroundColor: '#fff',
              color: '#4facfe',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }}
          >
            Start Formatting Now
            <ArrowRight size={20} />
          </button>
          
          <button
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
          >
            <Github size={20} />
            View on GitHub
          </button>
        </div>
        
        {/* Social Proof */}
        <div style={{
          marginTop: '48px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          opacity: 0.8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} />
            <span>50K+ monthly users</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} />
            <span>1M+ JSON files processed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} />
            <span>100% client-side</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;