import React, { useState, useEffect } from 'react';
import { X, Share2, Copy, Check, Twitter, Github } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, jsonContent, darkMode }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simple compression function for URLs (basic implementation)
  const compressJson = (jsonStr) => {
    try {
      // Remove unnecessary whitespace and encode
      const minified = JSON.stringify(JSON.parse(jsonStr));
      return btoa(encodeURIComponent(minified)).substring(0, 100); // Limit length
    } catch (e) {
      return btoa(encodeURIComponent(jsonStr)).substring(0, 100);
    }
  };

  const generateShareUrl = async () => {
    if (!jsonContent.trim()) return;
    
    setLoading(true);
    try {
      const compressed = compressJson(jsonContent);
      const url = `${window.location.origin}?shared=${compressed}`;
      setShareUrl(url);
    } catch (error) {
      console.error('Error generating share URL:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && jsonContent.trim()) {
      generateShareUrl();
    }
  }, [isOpen, jsonContent]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToTwitter = () => {
    const text = `Just formatted some JSON with GuidedJSON! 🚀 Check out this professional JSON tool: ${shareUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  };

  const shareToGitHub = () => {
    window.open('https://github.com/yourusername/json-formatter'); // Update with actual repo
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: darkMode 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Share2 size={24} color={darkMode ? '#60a5fa' : '#3b82f6'} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: darkMode ? '#f9fafb' : '#111827',
              margin: 0
            }}>
              Share JSON
            </h2>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6'
            }}
          >
            <X size={20} color={darkMode ? '#9ca3af' : '#6b7280'} />
          </button>
        </div>

        {/* Content */}
        <div>
          {jsonContent.trim() ? (
            <>
              <p style={{
                color: darkMode ? '#9ca3af' : '#6b7280',
                marginBottom: '20px',
                fontSize: '16px'
              }}>
                Share your JSON with others using a secure, compressed URL
              </p>

              {loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: darkMode ? '#9ca3af' : '#6b7280'
                }}>
                  Generating share link...
                </div>
              ) : shareUrl ? (
                <div>
                  {/* URL Input */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: darkMode ? '1px solid #4b5563' : '1px solid #d1d5db',
                        backgroundColor: darkMode ? '#374151' : '#f9fafb',
                        color: darkMode ? '#f9fafb' : '#111827',
                        fontSize: '14px',
                        fontFamily: 'ui-monospace, SFMono-Regular, monospace'
                      }}
                    />
                    <button
                      onClick={copyToClipboard}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: copied ? '#10b981' : (darkMode ? '#3b82f6' : '#2563eb'),
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {/* Social Share Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center'
                  }}>
                    <button
                      onClick={shareToTwitter}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: '#1da1f2',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '500'
                      }}
                    >
                      <Twitter size={16} />
                      Twitter
                    </button>
                    
                    <button
                      onClick={shareToGitHub}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: darkMode ? '#6b7280' : '#374151',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '500'
                      }}
                    >
                      <Github size={16} />
                      Star on GitHub
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p style={{
              color: darkMode ? '#9ca3af' : '#6b7280',
              textAlign: 'center',
              fontSize: '16px',
              margin: '40px 0'
            }}>
              Add some JSON content to generate a shareable link
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
