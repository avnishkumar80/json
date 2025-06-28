import React from 'react';

const SeoContent = ({ darkMode }) => {
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
    color: darkMode ? '#f3f4f6' : '#111827'
  };

  const headingStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: darkMode ? '#f3f4f6' : '#111827'
  };

  const subHeadingStyle = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '12px',
    color: darkMode ? '#f3f4f6' : '#111827'
  };

  const paragraphStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '16px',
    color: darkMode ? '#d1d5db' : '#374151'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  };

  const listStyle = {
    listStyle: 'disc',
    paddingLeft: '20px',
    lineHeight: '1.8',
    color: darkMode ? '#d1d5db' : '#374151'
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <section style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={headingStyle}>
          Professional JSON Formatter & Validator
        </h1>
        <p style={{ ...paragraphStyle, fontSize: '18px', maxWidth: '800px', margin: '0 auto 24px' }}>
          Format, validate, and edit JSON data with our free online JSON formatter. 
          Features include syntax validation, tree view, minification, and file operations.
        </p>
      </section>

      {/* Features Grid */}
      <section style={{ marginBottom: '40px' }}>
        <div style={gridStyle}>
          <div>
            <h2 style={subHeadingStyle}>
              🎨 JSON Formatting & Beautification
            </h2>
            <p style={paragraphStyle}>
              Instantly format and beautify your JSON data with proper indentation. 
              Choose between 2 or 4 space indentation for optimal readability.
            </p>
          </div>
          
          <div>
            <h2 style={subHeadingStyle}>
              ✅ Real-time JSON Validation
            </h2>
            <p style={paragraphStyle}>
              Validate JSON syntax in real-time with detailed error reporting. 
              Get precise line and column information for quick debugging.
            </p>
          </div>
          
          <div>
            <h2 style={subHeadingStyle}>
              🌳 Interactive Tree View
            </h2>
            <p style={paragraphStyle}>
              Visualize JSON structure with an interactive tree view. 
              Expand and collapse nodes to navigate complex JSON data easily.
            </p>
          </div>

          <div>
            <h2 style={subHeadingStyle}>
              📁 File Operations
            </h2>
            <p style={paragraphStyle}>
              Import JSON files directly from your computer and export formatted results. 
              Save your work with custom filenames.
            </p>
          </div>

          <div>
            <h2 style={subHeadingStyle}>
              🔍 Advanced Search
            </h2>
            <p style={paragraphStyle}>
              Search through your JSON data with powerful search functionality. 
              Navigate between results with keyboard shortcuts.
            </p>
          </div>

          <div>
            <h2 style={subHeadingStyle}>
              🎯 JSON Minification
            </h2>
            <p style={paragraphStyle}>
              Compress JSON by removing unnecessary whitespace. 
              Perfect for optimizing API responses and reducing file sizes.
            </p>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ ...subHeadingStyle, fontSize: '28px' }}>
          Why Choose GuidedJSON?
        </h2>
        <ul style={listStyle}>
          <li>100% free JSON formatting and validation tools</li>
          <li>No registration or sign-up required</li>
          <li>Works offline - no data sent to servers</li>
          <li>Professional features for developers</li>
          <li>Dark and light theme support</li>
          <li>Mobile-friendly responsive design</li>
          <li>File import and export capabilities</li>
          <li>Advanced search functionality</li>
          <li>Real-time syntax validation</li>
          <li>Copy to clipboard with one click</li>
        </ul>
      </section>

      {/* How to Use Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ ...subHeadingStyle, fontSize: '28px' }}>
          How to Use GuidedJSON
        </h2>
        <div style={gridStyle}>
          <div>
            <h3 style={subHeadingStyle}>1. Input Your JSON</h3>
            <p style={paragraphStyle}>
              Paste your JSON data into the editor or open a file from your computer. 
              The tool will automatically detect and validate the JSON format.
            </p>
          </div>
          <div>
            <h3 style={subHeadingStyle}>2. Format & Validate</h3>
            <p style={paragraphStyle}>
              Click "Format JSON" to beautify your data or "Minify JSON" to compress it. 
              Any syntax errors will be highlighted with detailed error messages.
            </p>
          </div>
          <div>
            <h3 style={subHeadingStyle}>3. Explore & Edit</h3>
            <p style={paragraphStyle}>
              Switch to Tree View to visualize your JSON structure. 
              Use the search function to quickly find specific keys or values.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 style={{ ...subHeadingStyle, fontSize: '28px' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={subHeadingStyle}>Is GuidedJSON free to use?</h3>
          <p style={paragraphStyle}>
            Yes, GuidedJSON is completely free to use. No registration, no hidden fees, no limitations.
          </p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={subHeadingStyle}>Is my JSON data secure?</h3>
          <p style={paragraphStyle}>
            Absolutely. All processing happens in your browser. Your JSON data never leaves your computer.
          </p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={subHeadingStyle}>Can I use this tool offline?</h3>
          <p style={paragraphStyle}>
            Yes, once loaded, GuidedJSON works offline. You can format and validate JSON without an internet connection.
          </p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={subHeadingStyle}>What file formats are supported?</h3>
          <p style={paragraphStyle}>
            You can import .json files and plain text files. Export options include .json format with custom filenames.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SeoContent;