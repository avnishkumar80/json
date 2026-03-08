import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLayout from './layouts/PageLayout';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CoreEditor = lazy(() => import('./components/CoreEditor/CoreEditor'));

function App() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#888' }}>Loading...</div>}>
            <Routes>
                {/* Full screen editor mode for the root pathway if we want it, or just Home */}
                <Route path="/" element={<Home />} />

                {/* Programmatic SEO Tool Pages */}
                <Route path="/:toolSlug" element={<PageLayout><ToolPage /></PageLayout>} />

                {/* Blog Routes */}
                <Route path="/blog" element={<PageLayout><BlogList /></PageLayout>} />
                <Route path="/blog/:slug" element={<PageLayout><BlogPost /></PageLayout>} />

                {/* Fallback to full screen editor for legacy / editor routes */}
                <Route path="/editor" element={<CoreEditor fullHeight={true} />} />
            </Routes>
        </Suspense>
    );
}

export default App;
