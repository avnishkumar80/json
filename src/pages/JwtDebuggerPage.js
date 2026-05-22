import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import * as jose from 'jose';
import Editor from '@monaco-editor/react';
import { useTheme } from '../hooks/useTheme';
import {
    ArrowLeft,
    Sun,
    Moon,
    Key,
    ShieldCheck,
    ShieldAlert,
    Copy,
    Check,
    RotateCcw,
    Lock,
    Unlock,
    Info,
    Clock,
    AlertTriangle
} from 'lucide-react';

const DEFAULT_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImFkbWluIjp0cnVlfQ.3yX6ZMBg7xM2v7B8m2gA8fX1-qD9Z5L2C3V4_X5Y6z7";

const JwtDebuggerPage = () => {
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [token, setToken] = useState(() => localStorage.getItem('jwtToken') || DEFAULT_JWT);
    const [secret, setSecret] = useState(() => localStorage.getItem('jwtSecret') || '');
    const [header, setHeader] = useState(null);
    const [payload, setPayload] = useState(null);
    const [isValid, setIsValid] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [copied, setCopied] = useState(false);

    // Styling constants
    const bg = darkMode ? '#0f172a' : '#f8fafc';
    const surface = darkMode ? '#1e293b' : '#ffffff';
    const border = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const text = darkMode ? '#f1f5f9' : '#0f172a';
    const muted = darkMode ? '#94a3b8' : '#64748b';
    const headerBg = darkMode ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)';
    const panelHeaderBg = darkMode ? 'rgba(15,23,42,0.4)' : '#f8fafc';

    const btnBase = {
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '7px 12px', border: `1px solid ${border}`, borderRadius: '8px',
        cursor: 'pointer', fontSize: '13px', fontWeight: '500',
        transition: 'all 0.15s', backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        color: darkMode ? '#e2e8f0' : '#475569',
    };

    const parseToken = useCallback((t) => {
        try {
            if (!t || t.split('.').length !== 3) {
                throw new Error("Invalid JWT format (requires header.payload.signature)");
            }
            const h = jose.decodeProtectedHeader(t);
            const p = jose.decodeJwt(t);
            setHeader(h);
            setPayload(p);
            setErrorMsg(null);
        } catch (e) {
            setHeader(null);
            setPayload(null);
            setErrorMsg(e.message);
            setIsValid(null);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('jwtToken', token);
        parseToken(token);
    }, [token, parseToken]);

    useEffect(() => {
        localStorage.setItem('jwtSecret', secret);
    }, [secret]);

    const verifySignature = async () => {
        if (!token || !header || !secret) {
            setIsValid(null);
            return;
        }

        try {
            const secretKey = new TextEncoder().encode(secret);
            // using jose.jwtVerify for symmetric verification
            await jose.jwtVerify(token, secretKey);
            setIsValid(true);
        } catch (e) {
            setIsValid(false);
        }
    };

    // Auto verify when secret or token changes
    useEffect(() => {
        if (header?.alg?.startsWith('HS')) {
            verifySignature();
        } else {
            setIsValid(null);
        }
    }, [token, secret, header]);


    const handleTokenChange = (val) => {
        setToken(val || '');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (_) { }
    };

    const handleClear = () => {
        setToken('');
        setSecret('');
    };

    // Human readable explanations
    const renderExplanation = () => {
        if (!payload) return null;

        const explanations = [];
        
        if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const isExpired = expDate < new Date();
            explanations.push({
                icon: <Clock size={16} className={isExpired ? "text-red-500" : "text-emerald-500"} />,
                title: 'Expiration (exp)',
                desc: isExpired ? `Expired on ${expDate.toLocaleString()}` : `Expires on ${expDate.toLocaleString()}`,
                alert: isExpired
            });
        } else {
            explanations.push({
                icon: <AlertTriangle size={16} className="text-amber-500" />,
                title: 'No Expiration (exp)',
                desc: 'Token does not expire. This is a security risk.',
                warning: true
            });
        }

        if (payload.iat) {
            explanations.push({
                icon: <Info size={16} className="text-blue-500" />,
                title: 'Issued At (iat)',
                desc: `Created on ${new Date(payload.iat * 1000).toLocaleString()}`
            });
        }

        if (payload.sub) {
            explanations.push({
                icon: <Info size={16} className="text-blue-500" />,
                title: 'Subject (sub)',
                desc: `Identifies the principal: ${payload.sub}`
            });
        }

        if (header?.alg === 'none') {
            explanations.push({
                icon: <ShieldAlert size={16} className="text-red-500" />,
                title: 'Insecure Algorithm',
                desc: 'Algorithm is set to "none". This token is highly insecure.',
                alert: true
            });
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: text, marginBottom: '8px' }}>Security & Claims Analysis</h3>
                {explanations.map((exp, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '12px', borderRadius: '8px',
                        backgroundColor: exp.alert ? (darkMode ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)') :
                                         exp.warning ? (darkMode ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.05)') :
                                         (darkMode ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)'),
                        border: `1px solid ${exp.alert ? '#ef4444' : exp.warning ? '#f59e0b' : '#3b82f6'}30`
                    }}>
                        <div style={{ marginTop: '2px' }}>{exp.icon}</div>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: text }}>{exp.title}</div>
                            <div style={{ fontSize: '12px', color: muted, marginTop: '2px' }}>{exp.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: bg, color: text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>
            <Helmet>
                <title>JWT Debugger – Decode, Verify & Analyze JWTs | GuidedJSON</title>
                <meta name="description" content="Secure, fast, local JWT debugger. Decode JSON Web Tokens, verify signatures, and analyze security claims instantly in your browser." />
            </Helmet>

            {/* ── Header ── */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 24px', backgroundColor: headerBg, backdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${border}`, zIndex: 10, flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate('/')} style={btnBase}>
                        <ArrowLeft size={16} /> Home
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Key size={18} color="#ec4899" />
                        <h1 style={{ fontSize: '17px', fontWeight: '700', margin: 0, letterSpacing: '-0.02em' }}>
                            JWT Debugger
                        </h1>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={handleCopy} style={{ ...btnBase, color: copied ? '#10b981' : btnBase.color }}>
                        {copied ? <Check size={15} /> : <Copy size={15} />}
                        {copied ? 'Copied!' : 'Copy Token'}
                    </button>
                    <button onClick={handleClear} style={btnBase}>
                        <RotateCcw size={15} /> Clear
                    </button>
                    <button onClick={toggleTheme} style={btnBase}>
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>
            </header>

            {/* ── Main content ── */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '20px', gap: '20px' }}>
                
                {/* Left pane: Encoded Token Input */}
                <div style={{
                    flex: '1 1 50%', display: 'flex', flexDirection: 'column',
                    borderRadius: '14px', border: `1px solid ${border}`,
                    backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                    boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
                    overflow: 'hidden', minWidth: 0,
                }}>
                    <div style={{
                        padding: '10px 16px', backgroundColor: panelHeaderBg,
                        borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                    }}>
                        <Lock size={14} color={muted} />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: muted, textTransform: 'uppercase' }}>Encoded Token</span>
                    </div>
                    
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <Editor
                            height="100%"
                            language="plaintext"
                            theme={darkMode ? 'vs-dark' : 'light'}
                            value={token}
                            onChange={handleTokenChange}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                                wordWrap: 'on',
                                lineNumbers: 'off',
                                padding: { top: 16, bottom: 16 },
                                renderWhitespace: 'none',
                                tabSize: 2,
                            }}
                        />
                    </div>
                    
                    {errorMsg && (
                        <div style={{ padding: '12px', backgroundColor: darkMode ? '#450a0a' : '#fef2f2', color: '#ef4444', fontSize: '13px', borderTop: `1px solid ${border}` }}>
                            <AlertTriangle size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                            {errorMsg}
                        </div>
                    )}
                </div>

                {/* Right pane: Decoded Data & Verification */}
                <div style={{
                    flex: '1 1 50%', display: 'flex', flexDirection: 'column',
                    borderRadius: '14px', border: `1px solid ${border}`,
                    backgroundColor: surface,
                    boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
                    overflow: 'hidden', minWidth: 0,
                }}>
                    <div style={{
                        padding: '10px 16px', backgroundColor: panelHeaderBg,
                        borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                    }}>
                        <Unlock size={14} color="#ec4899" />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: muted, textTransform: 'uppercase' }}>Decoded Content</span>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        {/* Header JSON */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Header (Algorithm & Type)</h3>
                            <div style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${border}` }}>
                                <Editor
                                    height="120px"
                                    language="json"
                                    theme={darkMode ? 'vs-dark' : 'light'}
                                    value={header ? JSON.stringify(header, null, 2) : ''}
                                    options={{ readOnly: true, minimap: { enabled: false }, lineNumbers: 'off', scrollBeyondLastLine: false }}
                                />
                            </div>
                        </div>

                        {/* Payload JSON */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#a855f7', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payload (Data)</h3>
                            <div style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${border}` }}>
                                <Editor
                                    height="250px"
                                    language="json"
                                    theme={darkMode ? 'vs-dark' : 'light'}
                                    value={payload ? JSON.stringify(payload, null, 2) : ''}
                                    options={{ readOnly: true, minimap: { enabled: false }, lineNumbers: 'off', scrollBeyondLastLine: false }}
                                />
                            </div>
                        </div>

                        {/* Signature Verification */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verify Signature</h3>
                            <div style={{ 
                                padding: '16px', borderRadius: '8px', 
                                border: `1px solid ${border}`,
                                backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'
                            }}>
                                <input
                                    type="text"
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                    placeholder="Enter your secret key (base64 or string)..."
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: '6px',
                                        border: `1px solid ${border}`, backgroundColor: surface, color: text,
                                        fontFamily: "'Fira Code', monospace", fontSize: '13px',
                                        outline: 'none', marginBottom: '12px'
                                    }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500' }}>
                                    {isValid === true && <><ShieldCheck size={18} color="#10b981" /> <span style={{ color: '#10b981' }}>Signature Verified</span></>}
                                    {isValid === false && <><ShieldAlert size={18} color="#ef4444" /> <span style={{ color: '#ef4444' }}>Invalid Signature</span></>}
                                    {isValid === null && <><Info size={18} color={muted} /> <span style={{ color: muted }}>Enter secret to verify</span></>}
                                </div>
                            </div>
                        </div>

                        {/* Explanations */}
                        {renderExplanation()}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JwtDebuggerPage;
