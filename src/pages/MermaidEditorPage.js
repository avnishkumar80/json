import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import mermaid from 'mermaid';
import { useTheme } from '../hooks/useTheme';
import { ArrowLeft, Palette, Sun, Moon, LayoutTemplate, Code, CheckCircle, AlertCircle } from 'lucide-react';

const MERMAID_EXAMPLES = {
  Flowchart: `graph TD;
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]`,
  Sequence: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,
  Gantt: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`,
  Class: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }`,
  ER: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        string name
        string custNumber
        string sector
    }
    ORDER ||--|{ LINE-ITEM : contains
    ORDER {
        int orderNumber
        string deliveryAddress
    }
    LINE-ITEM {
        string productCode
        int quantity
        float pricePerUnit
    }`,
  State: `stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
  Journey: `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`
};

const MermaidEditorPage = () => {
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    
    // Load from localStorage or use default
    const [code, setCode] = useState(() => {
        const saved = localStorage.getItem('mermaidCode');
        return saved || MERMAID_EXAMPLES.Flowchart;
    });
    const [svg, setSvg] = useState('');
    const [error, setError] = useState('');
    
    const [mermaidTheme, setMermaidTheme] = useState(() => {
        const savedTheme = localStorage.getItem('mermaidTheme');
        return savedTheme || (darkMode ? 'dark' : 'default');
    });
    
    // Update local storage when code or theme changes
    useEffect(() => {
        localStorage.setItem('mermaidCode', code);
    }, [code]);
    
    useEffect(() => {
         localStorage.setItem('mermaidTheme', mermaidTheme);
    }, [mermaidTheme]);

    // Automatically switch base theme if global theme changes and user is on default settings
    useEffect(() => {
        if (!localStorage.getItem('mermaidTheme')) {
             setMermaidTheme(darkMode ? 'dark' : 'default');
        }
    }, [darkMode]);

    useEffect(() => {
        mermaid.initialize({ startOnLoad: false, theme: mermaidTheme });
        
        // When theme changes, force a re-render
        renderDiagram(code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mermaidTheme]);

    const renderDiagram = async (diagramCode) => {
        if (!diagramCode.trim()) {
            setSvg('');
            setError('');
            return;
        }
        try {
            setError('');
            // Use a unique ID for the mermaid render to avoid DOM cache issues across theme switches
            const id = 'mermaid-preview-' + Date.now();
            const { svg: renderedSvg } = await mermaid.render(id, diagramCode);
            setSvg(renderedSvg);
        } catch (err) {
            setError(err.message || 'Invalid mermaid syntax');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            renderDiagram(code);
        }, 500);

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    const handleExampleChange = (e) => {
        const exampleKey = e.target.value;
        if (exampleKey && MERMAID_EXAMPLES[exampleKey]) {
            setCode(MERMAID_EXAMPLES[exampleKey]);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
            color: darkMode ? '#f1f5f9' : '#0f172a',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            overflow: 'hidden'
        }}>
            <Helmet>
                <title>Mermaid Live Editor - GuidedJSON</title>
                <meta name="description" content="A live editor for Mermaid diagrams. Create architectures, flowcharts, and sequence diagrams live." />
            </Helmet>

            {/* Application Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 12px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, borderRadius: '8px',
                            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                            color: darkMode ? '#e2e8f0' : '#475569',
                            cursor: 'pointer', fontSize: '14px', fontWeight: '500',
                            transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <ArrowLeft size={16} /> Home
                    </button>
                    <div>
                        <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0, letterSpacing: '-0.025em' }}>Mermaid Studio</h1>
                        <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b', margin: 0 }}>Diagrams as Code</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Examples Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px', backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.5)' : '#f1f5f9', borderRadius: '8px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                        <LayoutTemplate size={16} style={{ marginLeft: '8px', color: darkMode ? '#94a3b8' : '#64748b' }} />
                        <select 
                            onChange={handleExampleChange}
                            defaultValue=""
                            style={{ 
                                background: 'transparent', border: 'none', color: darkMode ? '#f1f5f9' : '#0f172a',
                                padding: '6px', fontSize: '14px', outline: 'none', cursor: 'pointer', fontWeight: '500'
                            }}
                        >
                            <option value="" disabled>Load Example...</option>
                            {Object.keys(MERMAID_EXAMPLES).map(key => (
                                <option key={key} value={key} style={{ backgroundColor: darkMode ? '#1e293b' : '#fff' }}>{key}</option>
                            ))}
                        </select>
                    </div>

                    {/* Theme Select */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px', backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.5)' : '#f1f5f9', borderRadius: '8px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                        <Palette size={16} style={{ marginLeft: '8px', color: darkMode ? '#94a3b8' : '#64748b' }} />
                        <select 
                            value={mermaidTheme}
                            onChange={(e) => setMermaidTheme(e.target.value)}
                            style={{ 
                                background: 'transparent', border: 'none', color: darkMode ? '#f1f5f9' : '#0f172a',
                                padding: '6px', fontSize: '14px', outline: 'none', cursor: 'pointer', fontWeight: '500'
                            }}
                        >
                            <option value="default" style={{ backgroundColor: darkMode ? '#1e293b' : '#fff' }}>Theme: Default</option>
                            <option value="dark" style={{ backgroundColor: darkMode ? '#1e293b' : '#fff' }}>Theme: Dark</option>
                            <option value="forest" style={{ backgroundColor: darkMode ? '#1e293b' : '#fff' }}>Theme: Forest</option>
                            <option value="neutral" style={{ backgroundColor: darkMode ? '#1e293b' : '#fff' }}>Theme: Neutral</option>
                            <option value="base" style={{ backgroundColor: darkMode ? '#1e293b' : '#fff' }}>Theme: Base</option>
                        </select>
                    </div>

                    {/* Global Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            padding: '8px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, borderRadius: '8px', cursor: 'pointer',
                            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                            color: darkMode ? '#e2e8f0' : '#475569', display: 'flex', alignItems: 'center', transition: 'all 0.2s'
                        }}
                        title={darkMode ? 'Light Mode' : 'Dark Mode'}
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    
                </div>
            </header>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', padding: '24px', gap: '24px', overflow: 'hidden' }}>
                {/* Code Editor Column */}
                <div style={{
                    flex: '1 1 40%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    boxShadow: darkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                 }}>
                    <div style={{
                         padding: '12px 16px', backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.4)' : '#f8fafc',
                         borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                         display: 'flex', alignItems: 'center', gap: '8px',
                         fontWeight: '600', fontSize: '13px', color: darkMode ? '#cbd5e1' : '#64748b'
                    }}>
                        <Code size={16} /> Editor
                    </div>
                    <div style={{ flex: 1, backgroundColor: darkMode ? '#1e1e1e' : '#fffffe' }}>
                        <Editor
                            height="100%"
                            defaultLanguage="javascript" // monaco doesn't have mermaid natively without setup
                            theme={darkMode ? 'vs-dark' : 'light'}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            options={{ 
                                minimap: { enabled: false }, 
                                fontSize: 14, 
                                fontFamily: "'Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                                wordWrap: 'on', 
                                scrollBeyondLastLine: false, 
                                padding: { top: 16 } 
                            }}
                        />
                    </div>
                </div>

                {/* Live Preview Column */}
                <div style={{
                    flex: '1 1 60%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    backgroundImage: darkMode ? 'radial-gradient(#334155 1px, transparent 1px)' : 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                    position: 'relative'
                 }}>
                    {/* Floating Render Status Header */}
                    <div style={{
                         position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 10,
                         display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none'
                    }}>
                        <div style={{
                             padding: '6px 12px', backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                             borderRadius: '999px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                             display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: darkMode ? '#cbd5e1' : '#64748b', pointerEvents: 'auto',
                             boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                             Live Preview
                        </div>
                        {error && (
                            <div style={{
                                 padding: '6px 12px', backgroundColor: darkMode ? 'rgba(127, 29, 29, 0.8)' : 'rgba(254, 226, 226, 0.9)', color: darkMode ? '#fca5a5' : '#ef4444',
                                 borderRadius: '999px', border: `1px solid ${darkMode ? 'rgba(248, 113, 113, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, backdropFilter: 'blur(8px)',
                                 display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', pointerEvents: 'auto',
                                 boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <AlertCircle size={14} /> Syntax Error
                            </div>
                        )}
                        {!error && code.trim() && svg && (
                            <div style={{
                                 padding: '6px 12px', backgroundColor: darkMode ? 'rgba(20, 83, 45, 0.8)' : 'rgba(220, 252, 231, 0.9)', color: darkMode ? '#86efac' : '#16a34a',
                                 borderRadius: '999px', border: `1px solid ${darkMode ? 'rgba(74, 222, 128, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`, backdropFilter: 'blur(8px)',
                                 display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', pointerEvents: 'auto',
                                 boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <CheckCircle size={14} /> Valid
                            </div>
                        )}
                    </div>
                    
                    {/* SVG Render Container */}
                    <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 24px 24px' }}>
                        {error ? (
                            <div style={{
                                 backgroundColor: darkMode ? '#450a0a' : '#fef2f2', border: `1px solid ${darkMode ? '#7f1d1d' : '#fecaca'}`,
                                 padding: '24px', borderRadius: '12px', color: darkMode ? '#fca5a5' : '#ef4444',
                                 fontFamily: 'monospace', fontSize: '14px', maxWidth: '80%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                {error}
                            </div>
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{ __html: svg }}
                                style={{
                                    maxWidth: '100%', maxHeight: '100%',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%',
                                    transition: 'all 0.3s ease-in-out'
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MermaidEditorPage;
