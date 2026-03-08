import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../hooks/useTheme';

const articles = {
    'how-to-convert-json-to-typescript': {
        title: 'How to Convert JSON to TypeScript | GuidedJSON Blog',
        h1: 'How to Convert JSON API Responses to TypeScript Interfaces',
        content: 'TypeScript adds immense value by providing static typing to JavaScript. However, writing types manually for large JSON responses is tedious. Using automated converters can save hours...'
    },
    'best-json-tools-for-developers': {
        title: 'Best JSON Tools for Developers in 2024 | GuidedJSON Blog',
        h1: 'Best JSON Tools for Developers in 2024',
        content: 'Every developer needs a solid JSON validator and formatter in their toolkit. Here are the top features to look for...'
    },
    'json-schema-explained': {
        title: 'JSON Schema Explained Simply | GuidedJSON Blog',
        h1: 'JSON Schema Explained Simply',
        content: 'JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. Think of it as a blueprint for your data...'
    },
    'building-apis-with-json-structures': {
        title: 'Building APIs with JSON Structures | GuidedJSON Blog',
        h1: 'Building APIs with JSON Structures',
        content: 'When designing RESTful APIs, determining the optimal JSON response structure is critical for client consumption. Let\'s explore patterns...'
    }
};

const BlogPost = () => {
    const { slug } = useParams();
    const { darkMode } = useTheme();
    const article = articles[slug] || articles['json-schema-explained'];

    return (
        <article style={{ padding: '0 32px', maxWidth: '800px', margin: '0 auto' }}>
            <Helmet>
                <title>{article.title}</title>
                <meta name="description" content={article.content.substring(0, 150) + '...'} />
                <link rel="canonical" href={`https://guidedjson.com/blog/${slug}`} />
            </Helmet>

            <Link to="/blog" style={{ color: darkMode ? '#60a5fa' : '#2563eb', textDecoration: 'none', marginBottom: '32px', display: 'inline-block' }}>
                &larr; Back to Blog
            </Link>

            <h1 style={{ fontSize: '3rem', marginBottom: '24px', lineHeight: '1.2' }}>{article.h1}</h1>

            <div style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: darkMode ? '#cbd5e1' : '#475569'
            }}>
                <p>{article.content}</p>
                <p style={{ marginTop: '32px' }}>
                    <em>More content would go here in a full CMS implementation.</em>
                </p>
            </div>
        </article>
    );
};

export default BlogPost;
