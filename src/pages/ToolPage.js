import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CoreEditor from '../components/CoreEditor/CoreEditor';
import { toolSeoContent } from '../data/seoContent';
import { useTheme } from '../hooks/useTheme';

const ToolPage = () => {
    const { toolSlug } = useParams();
    const content = toolSeoContent[toolSlug] || toolSeoContent['json-formatter'];
    const { darkMode } = useTheme();

    const formattedSlug = toolSlug || 'json-formatter';
    const canonicalUrl = `https://guidedjson.com/${formattedSlug}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": content.structuredDataName,
        "url": canonicalUrl,
        "description": content.description,
        "applicationCategory": "DeveloperApplication",
        "browserRequirements": "Requires JavaScript",
        "operatingSystem": "All"
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": content.faq?.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        })) || []
    };

    return (
        <div style={{ padding: '0 32px' }}>
            <Helmet>
                <title>{content.title}</title>
                <meta name="description" content={content.description} />
                <link rel="canonical" href={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
                {content.faq && (
                    <script type="application/ld+json">
                        {JSON.stringify(faqSchema)}
                    </script>
                )}
            </Helmet>

            <section style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{content.h1}</h1>
                <p style={{ fontSize: '1.2rem', color: darkMode ? '#94a3b8' : '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    {content.intro}
                </p>
            </section>

            {/* Embedded CoreEditor */}
            <section style={{
                height: '800px',
                marginBottom: '64px',
                boxShadow: darkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <CoreEditor fullHeight={false} initialMode={formattedSlug} />
            </section>

            {/* SEO Content Section Below Tool */}
            {content.faq && content.faq.length > 0 && (
                <section style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '64px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {content.faq.map((item, index) => (
                            <div key={index} style={{
                                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                padding: '24px',
                                borderRadius: '8px',
                                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                            }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', fontWeight: '600' }}>{item.q}</h3>
                                <p style={{ color: darkMode ? '#cbd5e1' : '#475569', lineHeight: '1.6' }}>{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ToolPage;
