import React, { useState } from 'react';
import { Code2, ChevronDown, CheckCircle, Zap } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeViewer = ({ codeData, onShowMore }) => {
    const [activeTab, setActiveTab] = useState('brute_force');
    const [activeLang, setActiveLang] = useState('python');
    const [copied, setCopied] = useState(false);

    if (!codeData) return null;

    const currentCodeObj = codeData[activeTab];
    const isMultiLang = typeof currentCodeObj === 'object' && currentCodeObj !== null;

    // Default to the selected language if multi-lang, else fallback to just showing it as string
    const codeToShow = isMultiLang
        ? (currentCodeObj[activeLang] || currentCodeObj['python'] || Object.values(currentCodeObj)[0])
        : currentCodeObj;

    const handleCopy = () => {
        navigator.clipboard.writeText(codeToShow);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-panel tier-section" style={{ animationDelay: '0.4s' }}>
            <h2 className="section-title">
                <Code2 size={24} />
                Step 3: Implementation
            </h2>

            <div style={{ marginTop: '1.5rem' }}>
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'brute_force' ? 'active' : ''}`}
                        onClick={() => setActiveTab('brute_force')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <CheckCircle size={16} /> Brute Force
                    </button>
                    <button
                        className={`tab ${activeTab === 'optimal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('optimal')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <Zap size={16} /> Optimal Approach
                    </button>
                </div>

                {isMultiLang && (
                    <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                        {Object.keys(currentCodeObj).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setActiveLang(lang)}
                                className={`viz-lang-btn ${activeLang === lang ? 'active' : ''}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                )}

                <div style={{ position: 'relative' }}>
                    <button
                        onClick={handleCopy}
                        style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '4px',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}
                    >
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>

                    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <SyntaxHighlighter
                            language={activeLang === 'c' || activeLang === 'cpp' ? 'cpp' : activeLang === 'js' ? 'javascript' : activeLang}
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: '3rem 1.5rem 1.5rem 1.5rem',
                                fontSize: '0.9rem',
                                fontFamily: "'JetBrains Mono', monospace",
                                background: '#1e1e1e'
                            }}
                            showLineNumbers={false}
                        >
                            {codeToShow}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Still abstract? Want to see how it works step-by-step?</p>
                <button onClick={onShowMore} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    Play Visual Explanation <ChevronDown size={16} />
                </button>
            </div>
        </div>
    );
};

export default CodeViewer;
