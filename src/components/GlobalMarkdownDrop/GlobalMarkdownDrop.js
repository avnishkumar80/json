import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, BookOpen } from 'lucide-react';

/**
 * GlobalMarkdownDrop
 *
 * Wraps the entire app. When the user drags a .md / .markdown file over ANY
 * page (except Markdown Studio itself, which handles drops natively), a full-
 * screen animated overlay appears. On drop the file content is persisted to
 * localStorage and the user is navigated to /markdown-editor.
 */
const GlobalMarkdownDrop = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [droppedFileName, setDroppedFileName] = useState('');
    const dragCounterRef = useRef(0); // tracks nested drag-enter/leave pairs

    // Don't intercept when already on the Markdown Studio page
    const isMarkdownPage = location.pathname === '/markdown-editor';

    const isMarkdownFile = (file) => {
        if (!file) return false;
        return (
            file.name.endsWith('.md') ||
            file.name.endsWith('.markdown') ||
            file.type === 'text/markdown' ||
            file.type === 'text/x-markdown'
        );
    };

    const handleDragEnter = useCallback((e) => {
        if (isMarkdownPage) return;

        // Only activate overlay if the drag contains a File
        const hasFile = Array.from(e.dataTransfer.items || []).some(
            (item) => item.kind === 'file'
        );
        if (!hasFile) return;

        e.preventDefault();
        dragCounterRef.current += 1;
        if (dragCounterRef.current === 1) {
            setIsDragging(true);
        }
    }, [isMarkdownPage]);

    const handleDragLeave = useCallback((e) => {
        if (isMarkdownPage) return;
        dragCounterRef.current -= 1;
        if (dragCounterRef.current <= 0) {
            dragCounterRef.current = 0;
            setIsDragging(false);
        }
    }, [isMarkdownPage]);

    const handleDragOver = useCallback((e) => {
        if (isMarkdownPage) return;
        e.preventDefault();
        // Signal that we accept the drop
        e.dataTransfer.dropEffect = 'copy';
    }, [isMarkdownPage]);

    const handleDrop = useCallback((e) => {
        if (isMarkdownPage) return;
        e.preventDefault();
        dragCounterRef.current = 0;
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (!file || !isMarkdownFile(file)) return;

        setIsLoading(true);
        setDroppedFileName(file.name);

        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target.result;
            // Persist so MarkdownEditorPage reads it on mount
            localStorage.setItem('markdownContent', text);
            localStorage.setItem('markdownFileName', file.name);

            // Brief flash so the user sees the file name, then navigate
            setTimeout(() => {
                setIsLoading(false);
                setDroppedFileName('');
                navigate('/markdown-editor');
            }, 500);
        };
        reader.onerror = () => {
            setIsLoading(false);
            setDroppedFileName('');
        };
        reader.readAsText(file);
    }, [isMarkdownPage, navigate]);

    // Attach listeners to the window so drops outside React subtrees are caught
    useEffect(() => {
        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);
        return () => {
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

    const showOverlay = isDragging || isLoading;

    return (
        <>
            {children}

            {showOverlay && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        pointerEvents: 'none',
                        // Glassmorphism backdrop
                        backgroundColor: 'rgba(10, 14, 30, 0.82)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        animation: 'md-drop-fade-in 0.18s ease',
                    }}
                >
                    <style>{`
                        @keyframes md-drop-fade-in {
                            from { opacity: 0; }
                            to   { opacity: 1; }
                        }
                        @keyframes md-drop-pulse {
                            0%, 100% { transform: scale(1);   opacity: 1; }
                            50%       { transform: scale(1.08); opacity: 0.85; }
                        }
                        @keyframes md-drop-ring-spin {
                            to { transform: rotate(360deg); }
                        }
                        .md-drop-dashed-ring {
                            position: absolute;
                            inset: 32px;
                            border-radius: 28px;
                            border: 2.5px dashed rgba(99, 102, 241, 0.55);
                            animation: md-drop-ring-spin 12s linear infinite;
                            pointer-events: none;
                        }
                    `}</style>

                    {/* Dashed spinning border */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div className="md-drop-dashed-ring" />

                        {/* Icon area */}
                        <div style={{
                            width: '96px', height: '96px',
                            borderRadius: '24px',
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25))',
                            border: '1.5px solid rgba(139,92,246,0.45)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 48px rgba(99,102,241,0.35), 0 0 0 1px rgba(99,102,241,0.15)',
                            animation: isLoading ? 'none' : 'md-drop-pulse 1.8s ease-in-out infinite',
                        }}>
                            {isLoading
                                ? <BookOpen size={44} color="#a5b4fc" strokeWidth={1.5} />
                                : <Upload size={44} color="#a5b4fc" strokeWidth={1.5} />
                            }
                        </div>

                        {/* Text */}
                        <div style={{ textAlign: 'center' }}>
                            {isLoading ? (
                                <>
                                    <p style={{
                                        margin: 0, fontSize: '22px', fontWeight: '700',
                                        color: '#e0e7ff', letterSpacing: '-0.02em',
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}>
                                        Opening in Markdown Studio…
                                    </p>
                                    {droppedFileName && (
                                        <p style={{
                                            margin: '6px 0 0', fontSize: '14px', color: '#818cf8',
                                            fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                                        }}>
                                            {droppedFileName}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p style={{
                                        margin: 0, fontSize: '24px', fontWeight: '700',
                                        color: '#e0e7ff', letterSpacing: '-0.02em',
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}>
                                        Drop to open in Markdown Studio
                                    </p>
                                    <p style={{
                                        margin: '8px 0 0', fontSize: '14px', color: '#94a3b8',
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}>
                                        Supports <code style={{ color: '#a5b4fc', fontFamily: '"Fira Code", monospace' }}>.md</code> and <code style={{ color: '#a5b4fc', fontFamily: '"Fira Code", monospace' }}>.markdown</code> files
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GlobalMarkdownDrop;
