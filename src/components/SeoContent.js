import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SeoContent = ({ darkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerStyle = {
    borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    color: darkMode ? '#f3f4f6' : '#111827'
  };

  const toggleButtonStyle = {
    width: '100%',
    padding: '16px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: darkMode ? '#9ca3af' : '#6b7280',
    transition: 'all 0.2s'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px 40px 20px',
    display: isExpanded ? 'block' : 'none'
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: darkMode ? '#f3f4f6' : '#111827'
  };

  const subHeadingStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: darkMode ? '#f3f4f6' : '#111827'
  };

  const paragraphStyle = {
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '12px',
    color: darkMode ? '#d1d5db' : '#374151'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  };

  return (
    <div style={containerStyle}>
      {/* Collapsible Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        style={toggleButtonStyle}
      >
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        <span>{isExpanded ? 'Hide' : 'Show'} JSON Tool Information</span>
      </button>

      {/* Collapsible Content */}
      <div style={contentStyle}>
        {/* Compact Features Grid */}
        <section style={{ marginBottom: '32px' }}>
          <div style={gridStyle}>
            <div>
              <h3 style={subHeadingStyle}>🎨 JSON Formatting</h3>
              <p style={paragraphStyle}>
                Instantly format and beautify JSON data with proper indentation and syntax highlighting.
              </p>
            </div>
            
            <div>
              <h3 style={subHeadingStyle}>✅ Real-time Validation</h3>
              <p style={paragraphStyle}>
                Validate JSON syntax in real-time with detailed error reporting and auto-fix suggestions.
              </p>
            </div>
            
            <div>
              <h3 style={subHeadingStyle}>🌳 Interactive Tree View</h3>
              <p style={paragraphStyle}>
                Visualize JSON structure with expandable tree view for easy navigation of complex data.
              </p>
            </div>

            <div>
              <h3 style={subHeadingStyle}>⌨️ Keyboard Shortcuts</h3>
              <p style={paragraphStyle}>
                Professional keyboard shortcuts for formatting, validation, and navigation (Ctrl+F, Ctrl+K, etc.).
              </p>
            </div>

            <div>
              <h3 style={subHeadingStyle}>🔍 Advanced Search</h3>
              <p style={paragraphStyle}>
                Search through JSON data with powerful search functionality and result navigation.
              </p>
            </div>

            <div>
              <h3 style={subHeadingStyle}>🔗 Share & Export</h3>
              <p style={paragraphStyle}>
                Share JSON via URLs, export files, and copy formatted results with one click.
              </p>
            </div>
          </div>
        </section>
        
        {/* Compact Benefits */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={headingStyle}>Why Choose GuidedJSON?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            fontSize: '14px',
            color: darkMode ? '#d1d5db' : '#374151'
          }}>
            <div>✅ 100% Free & No Registration</div>
            <div>🔒 100% Client-Side Processing</div>
            <div>⚡ Lightning Fast Performance</div>
            <div>📱 Mobile-Friendly Design</div>
            <div>🎨 Dark & Light Themes</div>
            <div>⌨️ Professional Shortcuts</div>
            <div>🛠️ Auto-Fix Suggestions</div>
            <div>🔍 Advanced Search Features</div>
          </div>
        </section>

        {/* Compact FAQ */}
        <section>
          <h2 style={headingStyle}>FAQ</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div>
              <h4 style={{ ...subHeadingStyle, fontSize: '16px', marginBottom: '4px' }}>Is it free?</h4>
              <p style={paragraphStyle}>Yes, completely free with no limitations or registration required.</p>
            </div>
            <div>
              <h4 style={{ ...subHeadingStyle, fontSize: '16px', marginBottom: '4px' }}>Is it secure?</h4>
              <p style={paragraphStyle}>Absolutely. All processing happens in your browser. No data is sent to servers.</p>
            </div>
            <div>
              <h4 style={{ ...subHeadingStyle, fontSize: '16px', marginBottom: '4px' }}>Works offline?</h4>
              <p style={paragraphStyle}>Yes, once loaded you can format and validate JSON without internet connection.</p>
            </div>
            <div>
              <h4 style={{ ...subHeadingStyle, fontSize: '16px', marginBottom: '4px' }}>File support?</h4>
              <p style={paragraphStyle}>Import .json files and plain text. Export as .json with custom filenames.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeoContent;
