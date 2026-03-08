import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const articles = [
    { slug: 'how-to-convert-json-to-typescript', title: 'How to Convert JSON to TypeScript', summary: 'Learn how inferring TypeScript types from JSON payloads can speed up your frontend development.' },
    { slug: 'best-json-tools-for-developers', title: 'Best JSON Tools for Developers in 2024', summary: 'A review of top JSON formatting and validation tools to add to your workflow.' },
    { slug: 'json-schema-explained', title: 'JSON Schema Explained Simply', summary: 'A primer on how JSON Schema Draft-07 works and why you need it for data contracts.' },
    { slug: 'building-apis-with-json-structures', title: 'Building APIs with JSON Structures', summary: 'Best practices for organizing responses and payloads in RESTful APIs using JSON.' },
];

const BlogList = () => {
    const { darkMode } = useTheme();

    return (
        <div style={{ padding: '0 32px', maxWidth: '800px', margin: '0 auto' }}>
            <Helmet>
                <title>Blog - Developer Guides on JSON and Web Technologies | GuidedJSON</title>
                <meta name="description" content="Read our latest articles on JSON parsing, TypeScript interface generation, schema validation, and web development tooling." />
                <link rel="canonical" href="https://guidedjson.com/blog" />
            </Helmet>

            <h1 style={{ fontSize: '3rem', marginBottom: '40px' }}>GuidedJSON Blog</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {articles.map(article => (
                    <article key={article.slug} style={{
                        padding: '32px',
                        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                        borderRadius: '12px',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                    }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>
                            <Link to={`/blog/${article.slug}`} style={{ color: darkMode ? '#60a5fa' : '#2563eb', textDecoration: 'none' }}>
                                {article.title}
                            </Link>
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: darkMode ? '#cbd5e1' : '#475569', lineHeight: '1.6' }}>
                            {article.summary}
                        </p>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default BlogList;
