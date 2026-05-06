import React, { useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import { useTheme } from '../hooks/useTheme';
import {
    ArrowLeft,
    Sun,
    Moon,
    FileText,
    Maximize2,
    Minimize2,
    Copy,
    Check,
    Upload,
    RotateCcw,
    BookOpen,
    Code2,
} from 'lucide-react';

const DEFAULT_MARKDOWN = `# Welcome to Markdown Studio

A **live** editor with real-time preview. Start typing or drop a \`.md\` file!

---

## Features

- ✅ Live preview as you type
- 📁 Drag & drop \`.md\` file upload
- 🌙 Dark / Light mode
- ↔️ Split-pane layout
- 🔍 Full-page preview

## Code Example

\`\`\`json
{
  "name": "GuidedJSON",
  "version": "1.0.0",
  "tools": ["JSON", "Mermaid", "Markdown"]
}
\`\`\`

## Quick Table

| Tool | Purpose | Route |
|------|---------|-------|
| JSON Editor | Format & validate JSON | \`/\` |
| Mermaid Studio | Diagram as code | \`/mermaid-editor\` |
| Markdown Studio | Live MD preview | \`/markdown-editor\` |

> "Good documentation is like a love letter to your future self."

---

*Happy writing! ✍️*
`;

const MarkdownEditorPage = () => {
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [content, setContent] = useState(() => {
        return localStorage.getItem('markdownContent') || DEFAULT_MARKDOWN;
    });
    const [isFullPreview, setIsFullPreview] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedHtml, setCopiedHtml] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState(() => {
        return localStorage.getItem('markdownFileName') || '';
    });

    // ─── Computed stats ─────────────────────────────────────────────────
    const words = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
    const lines = content.split('\n').length;
    const readMin = Math.max(1, Math.ceil(words / 200));

    const previewRef = useRef(null);
    const containerRef = useRef(null);

    // ─── Resizable divider ───────────────────────────────────────────────
    const [editorWidthPct, setEditorWidthPct] = useState(50);
    const [isDividerHovered, setIsDividerHovered] = useState(false);
    const [isDividerDragging, setIsDividerDragging] = useState(false);
    const isDraggingDivider = useRef(false);
    const dragStartX = useRef(0);
    const dragStartWidth = useRef(0);

    const handleDividerMouseDown = useCallback((e) => {
        e.preventDefault();
        isDraggingDivider.current = true;
        dragStartX.current = e.clientX;
        dragStartWidth.current = editorWidthPct;
        setIsDividerDragging(true);
    }, [editorWidthPct]);

    React.useEffect(() => {
        const onMove = (e) => {
            if (!isDraggingDivider.current || !containerRef.current) return;
            const containerW = containerRef.current.offsetWidth;
            const deltaPct = ((e.clientX - dragStartX.current) / containerW) * 100;
            setEditorWidthPct(prev => Math.min(80, Math.max(20, dragStartWidth.current + deltaPct)));
        };
        const onUp = () => {
            if (isDraggingDivider.current) {
                isDraggingDivider.current = false;
                setIsDividerDragging(false);
            }
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
    }, []);

    // Persist to localStorage — Monaco passes value directly (not an event)
    const handleContentChange = (val) => {
        const next = val ?? '';
        setContent(next);
        localStorage.setItem('markdownContent', next);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (_) { }
    };

    const handleCopyHtml = async () => {
        try {
            const html = previewRef.current?.innerHTML || '';
            await navigator.clipboard.writeText(html);
            setCopiedHtml(true);
            setTimeout(() => setCopiedHtml(false), 2000);
        } catch (_) { }
    };

    const handleClear = () => {
        if (content && !window.confirm('Clear all content?')) return;
        setContent('');
        setFileName('');
        localStorage.removeItem('markdownContent');
        localStorage.removeItem('markdownFileName');
    };

    const loadFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            setContent(text);
            setFileName(file.name);
            localStorage.setItem('markdownContent', text);
            localStorage.setItem('markdownFileName', file.name);
        };
        reader.readAsText(file);
    };

    const handleFileInputChange = (e) => {
        loadFile(e.target.files[0]);
        e.target.value = '';
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt') || file.type === 'text/plain')) {
            loadFile(file);
        }
    }, []);

    // ─── Colours & tokens ──────────────────────────────────────────────
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

    // ─── Markdown prose styles injected as a <style> tag ──────────────
    const proseStyles = `
        .md-preview {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 15px;
            line-height: 1.75;
            color: ${text};
            max-width: 72ch;
            margin: 0 auto;
        }
        .md-preview h1, .md-preview h2, .md-preview h3,
        .md-preview h4, .md-preview h5, .md-preview h6 {
            margin: 1.5em 0 0.5em;
            font-weight: 700;
            line-height: 1.25;
            color: ${text};
        }
        .md-preview h1 { font-size: 2em; border-bottom: 2px solid ${border}; padding-bottom: 0.3em; }
        .md-preview h2 { font-size: 1.5em; border-bottom: 1px solid ${border}; padding-bottom: 0.25em; }
        .md-preview h3 { font-size: 1.25em; }
        .md-preview p { margin: 0.75em 0; }
        .md-preview a { color: #3b82f6; text-decoration: underline; }
        .md-preview a:hover { color: #2563eb; }
        .md-preview strong { font-weight: 700; }
        .md-preview em { font-style: italic; }
        .md-preview code {
            background: ${darkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'};
            color: ${darkMode ? '#a5b4fc' : '#4f46e5'};
            padding: 0.15em 0.45em;
            border-radius: 4px;
            font-size: 0.88em;
            font-family: 'Fira Code', 'JetBrains Mono', monospace;
        }
        .md-preview pre {
            background: ${darkMode ? '#0f172a' : '#1e293b'};
            border-radius: 10px;
            padding: 20px;
            overflow-x: auto;
            margin: 1.25em 0;
            border: 1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'};
        }
        .md-preview pre code {
            background: none;
            color: ${darkMode ? '#e2e8f0' : '#f1f5f9'};
            padding: 0;
            font-size: 0.9em;
        }
        .md-preview blockquote {
            border-left: 4px solid #6366f1;
            margin: 1.25em 0;
            padding: 10px 20px;
            background: ${darkMode ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'};
            border-radius: 0 8px 8px 0;
            color: ${muted};
            font-style: italic;
        }
        .md-preview ul, .md-preview ol { margin: 0.75em 0; padding-left: 1.5em; }
        .md-preview li { margin: 0.35em 0; }
        .md-preview hr {
            border: none;
            border-top: 1px solid ${border};
            margin: 2em 0;
        }
        .md-preview table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.25em 0;
            font-size: 14px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid ${border};
        }
        .md-preview th {
            background: ${darkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.07)'};
            padding: 10px 16px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid ${border};
        }
        .md-preview td {
            padding: 10px 16px;
            border-bottom: 1px solid ${border};
        }
        .md-preview tr:last-child td { border-bottom: none; }
        .md-preview tr:hover td {
            background: ${darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'};
        }
        .md-preview img { max-width: 100%; border-radius: 8px; }

        .md-icon-btn:hover { opacity: 0.75; transform: translateY(-1px); }
        .md-icon-btn:active { transform: translateY(0); opacity: 1; }
    `;

    return (
        <div
            style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: bg, color: text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <style>{proseStyles}</style>

            <Helmet>
                <title>Markdown Studio – Live Editor & Preview | GuidedJSON</title>
                <meta name="description" content="Write and preview Markdown in real time. Supports GFM tables, code blocks, drag & drop file upload, and full-page preview." />
            </Helmet>

            {/* ── Drag overlay ── */}
            {isDragging && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    backgroundColor: darkMode ? 'rgba(15,23,42,0.92)' : 'rgba(248,250,252,0.92)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: `3px dashed #6366f1`,
                    backdropFilter: 'blur(4px)',
                    pointerEvents: 'none',
                }}>
                    <Upload size={56} color="#6366f1" strokeWidth={1.5} />
                    <p style={{ marginTop: '16px', fontSize: '20px', fontWeight: '600', color: '#6366f1' }}>Drop your .md file here</p>
                </div>
            )}

            {/* ── Header ── */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 24px',
                backgroundColor: headerBg,
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${border}`,
                zIndex: 10, flexShrink: 0,
            }}>
                {/* Left: Back + title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate('/')} style={btnBase} className="md-icon-btn">
                        <ArrowLeft size={16} /> Home
                    </button>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={18} color="#6366f1" />
                            <h1 style={{ fontSize: '17px', fontWeight: '700', margin: 0, letterSpacing: '-0.02em' }}>
                                Markdown Studio
                            </h1>
                        </div>
                        {fileName && (
                            <p style={{ fontSize: '11px', color: muted, margin: 0, marginTop: '1px' }}>{fileName}</p>
                        )}
                    </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Upload */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        style={btnBase} className="md-icon-btn"
                        title="Open .md file"
                    >
                        <Upload size={15} /> Open File
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".md,.txt,text/plain,text/markdown"
                        style={{ display: 'none' }}
                        onChange={handleFileInputChange}
                    />

                    {/* Copy MD */}
                    <button
                        onClick={handleCopy}
                        style={{ ...btnBase, color: copied ? '#10b981' : btnBase.color }}
                        className="md-icon-btn"
                        title="Copy markdown source"
                    >
                        {copied ? <Check size={15} /> : <Copy size={15} />}
                        {copied ? 'Copied!' : 'Copy MD'}
                    </button>

                    {/* Copy HTML */}
                    <button
                        onClick={handleCopyHtml}
                        style={{ ...btnBase, color: copiedHtml ? '#10b981' : btnBase.color }}
                        className="md-icon-btn"
                        title="Copy rendered HTML"
                    >
                        {copiedHtml ? <Check size={15} /> : <Code2 size={15} />}
                        {copiedHtml ? 'Copied!' : 'Copy HTML'}
                    </button>

                    {/* Clear */}
                    <button onClick={handleClear} style={btnBase} className="md-icon-btn" title="Clear content">
                        <RotateCcw size={15} />
                    </button>

                    {/* Full preview toggle */}
                    <button
                        onClick={() => setIsFullPreview(v => !v)}
                        style={{
                            ...btnBase,
                            backgroundColor: isFullPreview
                                ? (darkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)')
                                : btnBase.backgroundColor,
                            color: isFullPreview ? '#6366f1' : btnBase.color,
                            borderColor: isFullPreview ? 'rgba(99,102,241,0.4)' : border,
                        }}
                        className="md-icon-btn"
                        title={isFullPreview ? 'Split view' : 'Full preview'}
                    >
                        {isFullPreview ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                        {isFullPreview ? 'Split' : 'Preview'}
                    </button>

                    {/* Dark mode */}
                    <button onClick={toggleTheme} style={btnBase} className="md-icon-btn" title={darkMode ? 'Light mode' : 'Dark mode'}>
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>
            </header>

            {/* ── Main two-pane area ── */}
            <div
                ref={containerRef}
                style={{
                    flex: 1, display: 'flex', overflow: 'hidden',
                    padding: '20px', gap: 0,
                    cursor: isDividerDragging ? 'col-resize' : 'default',
                    userSelect: isDividerDragging ? 'none' : 'auto',
                }}
            >

                {/* Editor pane — hidden in full preview */}
                {!isFullPreview && (
                    <div style={{
                        flexShrink: 0,
                        width: `${editorWidthPct}%`,
                        display: 'flex', flexDirection: 'column',
                        borderRadius: '14px',
                        border: `1px solid ${border}`,
                        backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                        boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
                        overflow: 'hidden',
                        minWidth: 0,
                    }}>
                        {/* Pane header */}
                        <div style={{
                            padding: '10px 16px',
                            backgroundColor: panelHeaderBg,
                            borderBottom: `1px solid ${border}`,
                            display: 'flex', alignItems: 'center', gap: '8px',
                            flexShrink: 0,
                        }}>
                            <FileText size={14} color={muted} />
                            <span style={{ fontSize: '12px', fontWeight: '600', color: muted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Editor
                            </span>
                            {/* Stats badges */}
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: muted, padding: '2px 8px', backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderRadius: '999px' }}>
                                    {words.toLocaleString()} words
                                </span>
                                <span style={{ fontSize: '11px', color: muted, padding: '2px 8px', backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderRadius: '999px' }}>
                                    {lines} lines
                                </span>
                                <span style={{ fontSize: '11px', color: muted, padding: '2px 8px', backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderRadius: '999px' }}>
                                    ~{readMin} min read
                                </span>
                            </div>
                        </div>

                        {/* Monaco Editor */}
                        <div style={{ flex: 1, overflow: 'hidden', backgroundColor: darkMode ? '#1e1e1e' : '#fffffe' }}>
                            <Editor
                                height="100%"
                                language="markdown"
                                theme={darkMode ? 'vs-dark' : 'light'}
                                value={content}
                                onChange={handleContentChange}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    fontFamily: "'Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                                    wordWrap: 'on',
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    padding: { top: 16, bottom: 16 },
                                    renderWhitespace: 'none',
                                    smoothScrolling: true,
                                    cursorBlinking: 'smooth',
                                    cursorSmoothCaretAnimation: 'on',
                                    bracketPairColorization: { enabled: true },
                                    tabSize: 2,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Drag-to-resize divider ── */}
                {!isFullPreview && (
                    <div
                        onMouseDown={handleDividerMouseDown}
                        onMouseEnter={() => setIsDividerHovered(true)}
                        onMouseLeave={() => setIsDividerHovered(false)}
                        style={{
                            width: '16px', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'col-resize', zIndex: 10, position: 'relative',
                            flexDirection: 'column', gap: '4px',
                        }}
                    >
                        {/* Vertical line */}
                        <div style={{
                            position: 'absolute', top: 0, bottom: 0,
                            width: isDividerHovered || isDividerDragging ? '3px' : '2px',
                            backgroundColor: isDividerHovered || isDividerDragging ? '#6366f1' : border,
                            borderRadius: '999px',
                            transition: 'width 0.15s, background-color 0.15s',
                            left: '50%', transform: 'translateX(-50%)',
                        }} />
                        {/* Grip dots */}
                        <div style={{
                            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                            display: 'flex', flexDirection: 'column', gap: '5px',
                            opacity: isDividerHovered || isDividerDragging ? 1 : 0,
                            transition: 'opacity 0.15s', zIndex: 1,
                        }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} style={{
                                    width: '5px', height: '5px', borderRadius: '50%',
                                    backgroundColor: '#6366f1',
                                    boxShadow: '0 0 4px rgba(99,102,241,0.5)',
                                }} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Preview pane */}
                <div style={{
                    flex: 1,
                    display: 'flex', flexDirection: 'column',
                    borderRadius: '14px',
                    border: `1px solid ${border}`,
                    backgroundColor: surface,
                    boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    minWidth: 0,
                }}>
                    {/* Pane header */}
                    <div style={{
                        padding: '10px 16px',
                        backgroundColor: panelHeaderBg,
                        borderBottom: `1px solid ${border}`,
                        display: 'flex', alignItems: 'center', gap: '8px',
                        flexShrink: 0,
                    }}>
                        <BookOpen size={14} color="#6366f1" />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: muted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Preview
                        </span>
                        <div style={{
                            marginLeft: 'auto',
                            width: '8px', height: '8px', borderRadius: '50%',
                            backgroundColor: '#10b981',
                            boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                        }} title="Live" />
                    </div>

                    {/* Rendered markdown */}
                    <div ref={previewRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                        {content.trim() ? (
                            <div className="md-preview">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div style={{
                                height: '100%', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', gap: '12px',
                                color: muted, textAlign: 'center',
                            }}>
                                <BookOpen size={48} strokeWidth={1} color={muted} />
                                <p style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>Nothing to preview yet</p>
                                <p style={{ fontSize: '13px', margin: 0 }}>Start typing in the editor, or open a .md file</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkdownEditorPage;
