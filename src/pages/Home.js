import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CoreEditor from '../components/CoreEditor/CoreEditor';
import { useTheme } from '../hooks/useTheme';

const Home = () => {
    const { darkMode } = useTheme();

    return (
        <>
            <Helmet>
                <title>GuidedJSON – JSON to Schema, Typescript, Forms & API Generator</title>
                <meta name="description" content="Convert JSON into schema, forms, APIs and developer-ready structures. Free JSON developer tools for validation, formatting and schema generation." />
                <meta property="og:title" content="GuidedJSON – JSON to Schema, Typescript, Forms & API Generator" />
                <meta property="og:description" content="Convert JSON into schema, forms, APIs and developer-ready structures." />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://guidedjson.com/" />
            </Helmet>

            {/* If keeping full editor on Home, just render CoreEditor full height with an overlay or below it.
          Since users want what GuidedJSON does below and a normal website feel, let's wrap it nicely. */}

            <div style={{
                backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                color: darkMode ? '#f1f5f9' : '#0f172a',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>


                    <main style={{ flex: 1, overflow: 'hidden' }}>
                        <CoreEditor fullHeight={true} />
                    </main>
                </div>

                {/* Developer SEO Content Section */}
                <section id="about" style={{ padding: '80px 32px', maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '32px', textAlign: 'center' }}>What is GuidedJSON?</h2>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'center', marginBottom: '64px', color: darkMode ? '#cbd5e1' : '#475569' }}>
                        GuidedJSON is a powerful suite of professional developer tools designed to format, validate, and convert JSON structures directly in your browser securely and instantly.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        <div style={{ padding: '32px', backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderRadius: '8px', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Why Developers Use It</h3>
                            <p style={{ color: darkMode ? '#cbd5e1' : '#475569', lineHeight: '1.6' }}>
                                Stop relying on bloated desktop apps or ad-heavy websites. GuidedJSON offers a clean, lightning-fast React-based editor inspired by VS Code, equipped with dark mode, monaco-editor, tree-view graphs, and automated syntax fixers.
                            </p>
                        </div>

                        <div style={{ padding: '32px', backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderRadius: '8px', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Example Use Cases</h3>
                            <ul style={{ paddingLeft: '20px', color: darkMode ? '#cbd5e1' : '#475569', lineHeight: '1.8' }}>
                                <li><Link to="/json-to-schema" style={{ color: '#3b82f6' }}>Convert JSON to Schema reference</Link></li>
                                <li><Link to="/json-to-typescript" style={{ color: '#3b82f6' }}>Generate TypeScript interfaces instantly</Link></li>
                                <li><Link to="/json-to-api" style={{ color: '#3b82f6' }}>Build API payload structures securely</Link></li>
                                <li><Link to="/json-validator" style={{ color: '#3b82f6' }}>Validate and format standard JSON code</Link></li>
                            </ul>
                        </div>
                    </div>
                </section>

                <footer style={{
                    padding: '32px',
                    borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    textAlign: 'center',
                    color: darkMode ? '#94a3b8' : '#64748b',
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff'
                }}>
                    <p>&copy; {new Date().getFullYear()} GuidedJSON. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
};

export default Home;
