import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import { useTheme } from '../hooks/useTheme';
import {
    Sun, Moon, Upload, BookOpen, Share, Download,
    Bold, Italic, Strikethrough, List, ListOrdered,
    Link as LinkIcon, Image as ImageIcon, Code, Code2,
    Quote, Minus, Copy, Check, Grid, ChevronRight,
    Type, Eye, Columns, Edit3
} from 'lucide-react';

// ─── Default Content ────────────────────────────────────────────────────────
const DEFAULT_MARKDOWN = `# Welcome to Markdown Studio

A **live** editor with real-time preview. Start typing or drop a \`.md\` file!

---

## Features

- ✅ Live preview as you type
- 📁 Drag & drop \`.md\` file upload
- 🌙 Dark / Light mode
- ↔️ Split-pane layout with resizable divider
- 🔍 Full-page preview mode
- ✏️ Formatting toolbar with heading control

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

// ─── Heading options ─────────────────────────────────────────────────────────
const HEADING_OPTIONS = [
    { label: 'Normal text', value: 'normal', prefix: '' },
    { label: 'Heading 1', value: 'h1', prefix: '# ' },
    { label: 'Heading 2', value: 'h2', prefix: '## ' },
    { label: 'Heading 3', value: 'h3', prefix: '### ' },
    { label: 'Heading 4', value: 'h4', prefix: '#### ' },
];

// ─── Component ───────────────────────────────────────────────────────────────
const MarkdownEditorPage = () => {
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const containerRef = useRef(null);
    const previewRef = useRef(null);
    const fileNameInputRef = useRef(null);

    // ── State ────────────────────────────────────────────────────────────────
    const [content, setContent] = useState(() =>
        localStorage.getItem('markdownContent') || DEFAULT_MARKDOWN
    );
    // mode: 'view' | 'edit' | 'split'
    const [mode, setMode] = useState('split');
    const [copied, setCopied] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState(() =>
        localStorage.getItem('markdownFileName') || 'Document.md'
    );
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');
    const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);
    const headingMenuRef = useRef(null);

    // ── Computed stats ───────────────────────────────────────────────────────
    const words = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
    const chars = content.length;
    const lines = content.split('\n').length;
    const readMin = Math.max(1, Math.ceil(words / 200));

    // ── Resizable divider ────────────────────────────────────────────────────
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

    useEffect(() => {
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

    // Close heading menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (headingMenuRef.current && !headingMenuRef.current.contains(e.target)) {
                setShowHeadingMenu(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Content persistence ──────────────────────────────────────────────────
    const handleContentChange = (val) => {
        const next = val ?? '';
        setContent(next);
        localStorage.setItem('markdownContent', next);
    };

    // ── Monaco mount ─────────────────────────────────────────────────────────
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        editor.onDidChangeCursorPosition((e) => {
            setCursorPos({ line: e.position.lineNumber, col: e.position.column });
        });
    };

    // ── Toolbar helpers ──────────────────────────────────────────────────────
    const insertOrWrap = useCallback((before, after = '') => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        const selection = editor.getSelection();
        const selectedText = editor.getModel().getValueInRange(selection);
        const newText = `${before}${selectedText || 'text'}${after}`;
        editor.executeEdits('toolbar', [{
            range: selection,
            text: newText,
        }]);
        editor.focus();
    }, []);

    const insertAtLineStart = useCallback((prefix) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        const pos = editor.getPosition();
        const line = editor.getModel().getLineContent(pos.lineNumber);
        // Remove existing heading prefixes first
        const stripped = line.replace(/^(#{1,6}\s?)/, '');
        const newLine = prefix + stripped;
        editor.executeEdits('toolbar', [{
            range: {
                startLineNumber: pos.lineNumber,
                startColumn: 1,
                endLineNumber: pos.lineNumber,
                endColumn: line.length + 1,
            },
            text: newLine,
        }]);
        editor.focus();
    }, []);

    const insertBlock = useCallback((text) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        const pos = editor.getPosition();
        editor.executeEdits('toolbar', [{
            range: {
                startLineNumber: pos.lineNumber,
                startColumn: 1,
                endLineNumber: pos.lineNumber,
                endColumn: 1,
            },
            text: text,
        }]);
        editor.focus();
    }, []);

    // ── File actions ─────────────────────────────────────────────────────────
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (_) { }
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
        a.click();
        URL.revokeObjectURL(url);
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

    const handleFileInputChange = (e) => { loadFile(e.target.files[0]); e.target.value = ''; };

    const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt') || file.type === 'text/plain')) {
            loadFile(file);
        }
    }, []);

    // ── File rename ──────────────────────────────────────────────────────────
    const startRename = () => {
        setTempName(fileName.replace(/\.md$/, ''));
        setIsEditingName(true);
        setTimeout(() => fileNameInputRef.current?.select(), 10);
    };
    const commitRename = () => {
        const name = (tempName.trim() || 'Document') + '.md';
        setFileName(name);
        localStorage.setItem('markdownFileName', name);
        setIsEditingName(false);
    };
    const handleNameKeyDown = (e) => {
        if (e.key === 'Enter') commitRename();
        if (e.key === 'Escape') setIsEditingName(false);
    };

    // ── Colors / Tokens ─────────────────────────────────────────────────────
    const brand = '#0f6cbd';
    const brandDark = '#115ea3';

    const bgApp = darkMode ? '#11100f' : '#faf9f8';
    const bgHeader = darkMode ? '#1b1a19' : '#0f6cbd';
    const bgTabBar = darkMode ? '#252423' : '#ffffff';
    const borderNeutral = darkMode ? '#323130' : '#e1dfdd';
    const borderSubtle = darkMode ? '#292827' : '#edebe9';
    const textPrimary = darkMode ? '#ffffff' : '#323130';
    const textSecondary = darkMode ? '#a19f9d' : '#605e5c';
    const surfaceCode = darkMode ? '#1e1e1e' : '#ffffff';
    const surfacePreview = darkMode ? '#1b1a19' : '#ffffff';
    const btnHoverBg = darkMode ? '#323130' : '#e1dfdd';
    const btnActiveBg = darkMode ? '#484644' : '#c8c6c4';
    const tabActiveBorder = brand;
    const tabInactiveText = darkMode ? '#a19f9d' : '#605e5c';
    const tabActiveText = darkMode ? '#ffffff' : '#323130';

    // ── Prose styles ─────────────────────────────────────────────────────────
    const proseStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;500;600;700&display=swap');

        .md-preview {
            font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
            font-size: 15px;
            line-height: 1.7;
            color: ${textPrimary};
            max-width: 800px;
            margin: 0 auto;
            padding-bottom: 80px;
        }
        .md-preview h1 {
            font-size: 2em;
            font-weight: 700;
            margin: 0 0 0.75em;
            color: ${textPrimary};
            padding-bottom: 0.4em;
            border-bottom: 1px solid ${borderNeutral};
            line-height: 1.25;
        }
        .md-preview h2 {
            font-size: 1.5em;
            font-weight: 600;
            margin: 1.75em 0 0.6em;
            color: ${textPrimary};
            padding-bottom: 0.3em;
            border-bottom: 1px solid ${borderSubtle};
        }
        .md-preview h3 { font-size: 1.25em; font-weight: 600; margin: 1.5em 0 0.5em; color: ${textPrimary}; }
        .md-preview h4 { font-size: 1em; font-weight: 600; margin: 1.25em 0 0.4em; color: ${textPrimary}; }
        .md-preview h5, .md-preview h6 { font-size: 0.9em; font-weight: 600; margin: 1em 0 0.4em; color: ${textSecondary}; }
        .md-preview p { margin: 0.9em 0; }
        .md-preview a { color: ${brand}; text-decoration: none; }
        .md-preview a:hover { text-decoration: underline; color: ${brandDark}; }
        .md-preview strong { font-weight: 600; }
        .md-preview em { font-style: italic; }
        .md-preview del { text-decoration: line-through; color: ${textSecondary}; }
        .md-preview code {
            background: ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
            padding: 0.15em 0.45em;
            border-radius: 4px;
            font-size: 0.875em;
            font-family: "Cascadia Code", Consolas, "Courier New", monospace;
            border: 1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
            color: ${darkMode ? '#ce9178' : '#d73a49'};
        }
        .md-preview pre {
            background: ${darkMode ? '#1e1e1e' : '#f6f8fa'};
            border-radius: 6px;
            margin: 1.5em 0;
            overflow: hidden;
            border: 1px solid ${borderNeutral};
        }
        .md-preview pre > div.code-lang-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 14px;
            background: ${darkMode ? '#323130' : '#eaeaea'};
            font-size: 12px;
            font-family: "Segoe UI", sans-serif;
            color: ${textSecondary};
            border-bottom: 1px solid ${borderNeutral};
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .md-preview pre code {
            background: none;
            padding: 16px;
            display: block;
            overflow-x: auto;
            font-size: 0.875em;
            font-family: "Cascadia Code", Consolas, "Courier New", monospace;
            color: ${darkMode ? '#d4d4d4' : '#24292e'};
            border: none;
            line-height: 1.6;
        }
        .md-preview blockquote {
            border-left: 4px solid ${brand};
            background: ${darkMode ? 'rgba(15,108,189,0.08)' : 'rgba(15,108,189,0.05)'};
            margin: 1.5em 0;
            padding: 12px 16px;
            border-radius: 0 6px 6px 0;
            color: ${textSecondary};
        }
        .md-preview blockquote p { margin: 0; }
        .md-preview ul, .md-preview ol { margin: 0.75em 0; padding-left: 2em; }
        .md-preview li { margin: 0.35em 0; line-height: 1.6; }
        .md-preview li input[type="checkbox"] { margin-right: 6px; }
        .md-preview hr {
            border: none;
            border-top: 1px solid ${borderNeutral};
            margin: 2.5em 0;
        }
        .md-preview table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            font-size: 14px;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid ${borderNeutral};
        }
        .md-preview th, .md-preview td {
            padding: 10px 14px;
            border-bottom: 1px solid ${borderNeutral};
            border-right: 1px solid ${borderNeutral};
            text-align: left;
        }
        .md-preview th:last-child, .md-preview td:last-child { border-right: none; }
        .md-preview tr:last-child td { border-bottom: none; }
        .md-preview th {
            background: ${darkMode ? '#2d2c2b' : '#f3f2f1'};
            font-weight: 600;
            font-size: 13px;
            color: ${textSecondary};
            letter-spacing: 0.3px;
        }
        .md-preview tr:hover td {
            background: ${darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'};
        }
        .md-preview img { max-width: 100%; height: auto; border-radius: 4px; }

        /* Interactive elements */
        .md-toolbar-btn:hover { background-color: ${btnHoverBg} !important; }
        .md-toolbar-btn:active { background-color: ${btnActiveBg} !important; }
        .top-nav-btn:hover { background-color: rgba(255,255,255,0.12) !important; }
        .top-nav-btn:active { background-color: rgba(255,255,255,0.2) !important; }
        .tab-btn:hover { background-color: ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'} !important; }

        /* Scrollbar */
        .preview-scroll::-webkit-scrollbar { width: 8px; }
        .preview-scroll::-webkit-scrollbar-track { background: transparent; }
        .preview-scroll::-webkit-scrollbar-thumb { background: ${darkMode ? '#484644' : '#c8c6c4'}; border-radius: 4px; }
        .preview-scroll::-webkit-scrollbar-thumb:hover { background: ${darkMode ? '#605e5c' : '#a19f9d'}; }
    `;

    // ── Monaco options ────────────────────────────────────────────────────────
    const monacoOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'Cascadia Code', Consolas, 'Courier New', monospace",
        fontLigatures: true,
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
        renderLineHighlight: 'line',
        occurrencesHighlight: false,
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
    };

    // ── Shared button styles ──────────────────────────────────────────────────
    const toolbarBtnStyle = {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '30px', height: '30px',
        border: 'none', background: 'transparent', borderRadius: '4px',
        cursor: 'pointer', color: textPrimary,
        transition: 'background-color 0.1s',
        flexShrink: 0,
    };

    const cmdBtnStyle = {
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '0 10px', height: '100%',
        border: 'none', background: 'transparent',
        cursor: 'pointer', fontSize: '13px', fontWeight: '400',
        color: textPrimary,
        fontFamily: '"Segoe UI", -apple-system, sans-serif',
        transition: 'background-color 0.1s',
        whiteSpace: 'nowrap',
    };

    const divStyle = (isVertical = true) => ({
        [isVertical ? 'width' : 'height']: '1px',
        [isVertical ? 'height' : 'width']: isVertical ? '18px' : '1px',
        backgroundColor: borderNeutral,
        margin: isVertical ? '0 6px' : '6px 0',
        flexShrink: 0,
    });

    // ── Mode helpers ──────────────────────────────────────────────────────────
    const showEditor = mode === 'edit' || mode === 'split';
    const showPreview = mode === 'view' || mode === 'split';

    return (
        <div
            style={{
                height: '100vh', display: 'flex', flexDirection: 'column',
                backgroundColor: bgApp, color: textPrimary,
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                overflow: 'hidden',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <style>{proseStyles}</style>

            <Helmet>
                <title>{fileName} — Markdown Studio | GuidedJSON</title>
            </Helmet>

            {/* ── Drag overlay ───────────────────────────────────────────── */}
            {isDragging && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    backgroundColor: darkMode ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: `3px dashed ${brand}`,
                    backdropFilter: 'blur(4px)',
                }}>
                    <Upload size={56} color={brand} strokeWidth={1.5} />
                    <p style={{ marginTop: '16px', fontSize: '20px', fontWeight: '300', color: brand }}>
                        Drop to open Markdown file
                    </p>
                </div>
            )}

            {/* ── Suite Header ───────────────────────────────────────────── */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: '48px', padding: '0 12px',
                backgroundColor: bgHeader, color: '#fff',
                flexShrink: 0, gap: '8px',
            }}>
                {/* Left: waffle + breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, flex: 1 }}>
                    <button
                        className="top-nav-btn"
                        onClick={() => navigate('/')}
                        title="Home"
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'flex', flexShrink: 0 }}
                    >
                        <Grid size={20} />
                    </button>

                    {/* Breadcrumb */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '14px', minWidth: 0 }}>
                        <button
                            className="top-nav-btn"
                            onClick={() => navigate('/')}
                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', fontSize: '14px', fontWeight: '600' }}
                        >
                            GuidedJSON
                        </button>
                        <ChevronRight size={14} color="rgba(255,255,255,0.5)" style={{ flexShrink: 0 }} />
                        <span style={{ color: 'rgba(255,255,255,0.75)', padding: '4px 2px', whiteSpace: 'nowrap' }}>
                            Markdown Studio
                        </span>
                        <ChevronRight size={14} color="rgba(255,255,255,0.5)" style={{ flexShrink: 0 }} />

                        {/* Editable file name */}
                        {isEditingName ? (
                            <input
                                ref={fileNameInputRef}
                                value={tempName}
                                onChange={e => setTempName(e.target.value)}
                                onBlur={commitRename}
                                onKeyDown={handleNameKeyDown}
                                style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    padding: '2px 8px',
                                    outline: 'none',
                                    width: '180px',
                                    fontFamily: '"Segoe UI", sans-serif',
                                }}
                                autoFocus
                            />
                        ) : (
                            <button
                                className="top-nav-btn"
                                onClick={startRename}
                                title="Click to rename"
                                style={{
                                    background: 'none', border: 'none', color: '#fff',
                                    cursor: 'pointer', padding: '4px 6px', borderRadius: '4px',
                                    fontSize: '14px', fontWeight: '500',
                                    maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}
                            >
                                {fileName}
                            </button>
                        )}
                    </nav>
                </div>

                {/* Right: actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <button
                        className="top-nav-btn"
                        onClick={handleDownload}
                        title="Download .md file"
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                    >
                        <Download size={16} /> Download
                    </button>
                    <button
                        className="top-nav-btn"
                        title="Share"
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                    >
                        <Share size={16} /> Share
                    </button>
                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.25)', margin: '0 4px' }} />
                    <button
                        className="top-nav-btn"
                        onClick={toggleTheme}
                        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'flex' }}
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </header>

            {/* ── Mode Tab Bar ───────────────────────────────────────────── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: '40px',
                backgroundColor: bgTabBar,
                borderBottom: `1px solid ${borderNeutral}`,
                flexShrink: 0,
                padding: '0 12px',
            }}>
                {/* Mode tabs */}
                <div style={{ display: 'flex', alignItems: 'stretch', height: '100%', gap: '0' }}>
                    {[
                        { id: 'view', label: 'View', icon: <Eye size={14} /> },
                        { id: 'edit', label: 'Edit', icon: <Edit3 size={14} /> },
                        { id: 'split', label: 'Split', icon: <Columns size={14} /> },
                    ].map(tab => {
                        const isActive = mode === tab.id;
                        return (
                            <button
                                key={tab.id}
                                className="tab-btn"
                                onClick={() => setMode(tab.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '0 14px',
                                    border: 'none', background: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '13px', fontWeight: isActive ? '600' : '400',
                                    color: isActive ? tabActiveText : tabInactiveText,
                                    borderBottom: isActive ? `2px solid ${tabActiveBorder}` : '2px solid transparent',
                                    transition: 'all 0.15s',
                                    fontFamily: '"Segoe UI", sans-serif',
                                    flexShrink: 0,
                                }}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Right: file info + copy */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                        className="md-toolbar-btn"
                        onClick={handleCopy}
                        title="Copy markdown source"
                        style={{ ...cmdBtnStyle, height: '30px', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }}
                    >
                        {copied ? <Check size={14} color="#107c41" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        className="md-toolbar-btn"
                        onClick={() => fileInputRef.current?.click()}
                        title="Open .md file"
                        style={{ ...cmdBtnStyle, height: '30px', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }}
                    >
                        <Upload size={14} /> Open file
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".md,.txt,text/plain,text/markdown"
                        style={{ display: 'none' }}
                        onChange={handleFileInputChange}
                    />
                </div>
            </div>

            {/* ── Formatting Toolbar (Edit/Split only) ──────────────────── */}
            {showEditor && (
                <div style={{
                    display: 'flex', alignItems: 'center',
                    height: '38px', padding: '0 8px', gap: '2px',
                    backgroundColor: darkMode ? '#252423' : '#faf9f8',
                    borderBottom: `1px solid ${borderSubtle}`,
                    flexShrink: 0, overflowX: 'auto',
                }}>
                    {/* Heading dropdown */}
                    <div ref={headingMenuRef} style={{ position: 'relative' }}>
                        <button
                            className="md-toolbar-btn"
                            onClick={() => setShowHeadingMenu(v => !v)}
                            title="Heading style"
                            style={{
                                ...toolbarBtnStyle,
                                width: 'auto', padding: '0 10px', gap: '4px',
                                fontSize: '13px', fontFamily: '"Segoe UI", sans-serif',
                            }}
                        >
                            <Type size={14} />
                            <span style={{ fontSize: '12px', color: textSecondary }}>Heading</span>
                            <span style={{ fontSize: '10px', color: textSecondary, marginLeft: '1px' }}>▾</span>
                        </button>
                        {showHeadingMenu && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, zIndex: 100,
                                backgroundColor: darkMode ? '#323130' : '#ffffff',
                                border: `1px solid ${borderNeutral}`,
                                borderRadius: '4px',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.16)',
                                minWidth: '160px',
                                paddingTop: '4px', paddingBottom: '4px',
                            }}>
                                {HEADING_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            if (opt.prefix === '') {
                                                insertAtLineStart('');
                                            } else {
                                                insertAtLineStart(opt.prefix);
                                            }
                                            setShowHeadingMenu(false);
                                        }}
                                        style={{
                                            display: 'block', width: '100%',
                                            padding: '8px 14px', textAlign: 'left',
                                            border: 'none', background: 'transparent',
                                            cursor: 'pointer', color: textPrimary,
                                            fontSize: opt.value === 'normal' ? '13px' :
                                                opt.value === 'h1' ? '18px' :
                                                opt.value === 'h2' ? '15px' :
                                                opt.value === 'h3' ? '14px' : '13px',
                                            fontWeight: opt.value === 'normal' ? '400' : '600',
                                            fontFamily: '"Segoe UI", sans-serif',
                                            lineHeight: '1.4',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = btnHoverBg}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={divStyle(true)} />

                    {/* Text formatting */}
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Bold (Ctrl+B)" onClick={() => insertOrWrap('**', '**')}><Bold size={15} /></button>
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Italic (Ctrl+I)" onClick={() => insertOrWrap('*', '*')}><Italic size={15} /></button>
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Strikethrough" onClick={() => insertOrWrap('~~', '~~')}><Strikethrough size={15} /></button>

                    <div style={divStyle(true)} />

                    {/* Code */}
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Inline code" onClick={() => insertOrWrap('`', '`')}><Code size={15} /></button>
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Code block" onClick={() => insertBlock('```\ncode here\n```\n')}><Code2 size={15} /></button>

                    <div style={divStyle(true)} />

                    {/* Lists */}
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Bullet list" onClick={() => insertAtLineStart('- ')}><List size={15} /></button>
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Ordered list" onClick={() => insertAtLineStart('1. ')}><ListOrdered size={15} /></button>

                    <div style={divStyle(true)} />

                    {/* Block elements */}
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Blockquote" onClick={() => insertAtLineStart('> ')}><Quote size={15} /></button>
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Horizontal rule" onClick={() => insertBlock('\n---\n')}><Minus size={15} /></button>

                    <div style={divStyle(true)} />

                    {/* Link & Image */}
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Insert link" onClick={() => insertOrWrap('[', '](https://)')}><LinkIcon size={15} /></button>
                    <button className="md-toolbar-btn" style={toolbarBtnStyle} title="Insert image" onClick={() => insertOrWrap('![', '](https://)')}><ImageIcon size={15} /></button>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Word count pill in toolbar */}
                    <span style={{ fontSize: '12px', color: textSecondary, padding: '0 4px', whiteSpace: 'nowrap' }}>
                        {words.toLocaleString()} words
                    </span>
                </div>
            )}

            {/* ── Main Workspace ─────────────────────────────────────────── */}
            <div
                ref={containerRef}
                style={{
                    flex: 1, display: 'flex', overflow: 'hidden',
                    cursor: isDividerDragging ? 'col-resize' : 'default',
                    userSelect: isDividerDragging ? 'none' : 'auto',
                }}
            >
                {/* ── Editor Pane ───────────────────────────────────────── */}
                {showEditor && (
                    <div style={{
                        width: mode === 'edit' ? '100%' : `${editorWidthPct}%`,
                        display: 'flex', flexDirection: 'column',
                        backgroundColor: surfaceCode,
                        borderRight: mode === 'split' ? `1px solid ${borderNeutral}` : 'none',
                        flexShrink: 0,
                        transition: mode === 'split' ? 'none' : 'width 0.2s',
                    }}>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <Editor
                                height="100%"
                                language="markdown"
                                theme={darkMode ? 'vs-dark' : 'light'}
                                value={content}
                                onChange={handleContentChange}
                                onMount={handleEditorDidMount}
                                options={monacoOptions}
                            />
                        </div>
                    </div>
                )}

                {/* ── Resizable Divider ─────────────────────────────────── */}
                {mode === 'split' && (
                    <div
                        onMouseDown={handleDividerMouseDown}
                        onMouseEnter={() => setIsDividerHovered(true)}
                        onMouseLeave={() => setIsDividerHovered(false)}
                        style={{
                            width: '5px', flexShrink: 0,
                            cursor: 'col-resize', zIndex: 10,
                            backgroundColor: isDividerHovered || isDividerDragging ? brand : 'transparent',
                            transition: 'background-color 0.15s',
                        }}
                    />
                )}

                {/* ── Preview Pane ──────────────────────────────────────── */}
                {showPreview && (
                    <div style={{
                        flex: 1,
                        display: 'flex', flexDirection: 'column',
                        backgroundColor: surfacePreview,
                        overflow: 'hidden',
                        minWidth: 0,
                    }}>
                        <div
                            className="preview-scroll"
                            ref={previewRef}
                            style={{ flex: 1, overflowY: 'auto', padding: '36px 48px' }}
                        >
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
                                    color: textSecondary, textAlign: 'center', paddingTop: '80px',
                                }}>
                                    <BookOpen size={56} strokeWidth={1} color={darkMode ? '#484644' : '#c8c6c4'} />
                                    <h2 style={{ fontSize: '20px', fontWeight: '300', margin: 0, color: textPrimary }}>
                                        This document is empty
                                    </h2>
                                    <p style={{ fontSize: '14px', margin: 0, color: textSecondary }}>
                                        Start typing or open a Markdown file to see the preview.
                                    </p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            marginTop: '8px', padding: '8px 16px',
                                            backgroundColor: brand, color: '#fff',
                                            border: 'none', borderRadius: '4px',
                                            cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                        }}
                                    >
                                        <Upload size={14} /> Open file
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Status Bar ─────────────────────────────────────────────── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px',
                height: '24px',
                fontSize: '12px', color: textSecondary,
                backgroundColor: darkMode ? '#1e1e1e' : '#f3f2f1',
                borderTop: `1px solid ${borderNeutral}`,
                flexShrink: 0,
                gap: '16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span>{words.toLocaleString()} words</span>
                    <span style={{ color: borderNeutral }}>|</span>
                    <span>{chars.toLocaleString()} chars</span>
                    <span style={{ color: borderNeutral }}>|</span>
                    <span>{lines.toLocaleString()} lines</span>
                    <span style={{ color: borderNeutral }}>|</span>
                    <span>~{readMin} min read</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {showEditor && (
                        <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
                    )}
                    <span style={{ color: borderNeutral }}>|</span>
                    <span>Markdown</span>
                    <span style={{ color: borderNeutral }}>|</span>
                    <span>UTF-8</span>
                </div>
            </div>
        </div>
    );
};

export default MarkdownEditorPage;
