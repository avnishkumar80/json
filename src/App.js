import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLayout from './layouts/PageLayout';
import GlobalMarkdownDrop from './components/GlobalMarkdownDrop/GlobalMarkdownDrop';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CoreEditor = lazy(() => import('./components/CoreEditor/CoreEditor'));
const MermaidEditorPage = lazy(() => import('./pages/MermaidEditorPage'));
const MarkdownEditorPage = lazy(() => import('./pages/MarkdownEditorPage'));

function App() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#888' }}>Loading...</div>}>
            <GlobalMarkdownDrop>
            <Routes>
                {/* Full screen editor mode for the root pathway if we want it, or just Home */}
                <Route path="/" element={<Home />} />

                {/* Programmatic SEO Tool Pages */}
                <Route path="/:toolSlug" element={<PageLayout><ToolPage /></PageLayout>} />

                {/* Blog Routes */}
                <Route path="/blog" element={<PageLayout><BlogList /></PageLayout>} />
                <Route path="/blog/:slug" element={<PageLayout><BlogPost /></PageLayout>} />

                {/* Specific tools */}
                <Route path="/mermaid-editor" element={<MermaidEditorPage />} />
                <Route path="/markdown-editor" element={<MarkdownEditorPage />} />

                {/* Fallback to full screen editor for legacy / editor routes */}
                <Route path="/editor" element={<CoreEditor fullHeight={true} />} />
            </Routes>
            </GlobalMarkdownDrop>
        </Suspense>
    );
}

export default App;
