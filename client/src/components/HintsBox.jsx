import React from 'react';
import { Lightbulb, ChevronDown } from 'lucide-react';

const HintsBox = ({ hints, onShowMore }) => {
    if (!hints || hints.length === 0) return null;

    return (
        <div className="glass-panel tier-section">
            <h2 className="section-title">
                <Lightbulb size={24} />
                Step 1: Progressive Hints
            </h2>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {hints.map((hint, index) => (
                    <div key={index} className="hint-item" style={{
                        display: 'flex',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <span className="hint-marker">{index + 1}</span>
                        <p style={{ margin: 0, lineHeight: 1.5, flex: 1 }}>{hint}</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Still stuck after reading hints?</p>
                <button onClick={onShowMore} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    Reveal Logic & Data Structures <ChevronDown size={16} />
                </button>
            </div>
        </div>
    );
};

export default HintsBox;
