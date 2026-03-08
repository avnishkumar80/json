import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

const PageLayout = ({ children }) => {
    const { darkMode } = useTheme();

    return (
        <div style={{
            backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
            color: darkMode ? '#f1f5f9' : '#0f172a',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>


            <main style={{ flex: 1, padding: '32px 0' }}>
                {children}
            </main>

            <footer style={{
                padding: '32px',
                borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                textAlign: 'center',
                color: darkMode ? '#94a3b8' : '#64748b',
                fontSize: '0.875rem',
                marginTop: 'auto'
            }}>
                <p>&copy; {new Date().getFullYear()} GuidedJSON. All rights reserved.</p>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <Link to="/json-validator" style={{ color: 'inherit', textDecoration: 'none' }}>JSON Validator</Link>
                    <Link to="/json-formatter" style={{ color: 'inherit', textDecoration: 'none' }}>JSON Formatter</Link>
                    <Link to="/json-to-schema" style={{ color: 'inherit', textDecoration: 'none' }}>JSON Schema Generator</Link>
                </div>
            </footer>
        </div>
    );
};

export default PageLayout;
