import React from 'react';
import { BrainCircuit, Database, ChevronDown } from 'lucide-react';

const LogicBox = ({ logicData, onShowMore }) => {
    if (!logicData) return null;

    const { recommended_data_structures, english_explanation } = logicData;

    return (
        <div className="glass-panel tier-section" style={{ animationDelay: '0.2s' }}>
            <h2 className="section-title">
                <BrainCircuit size={24} />
                Step 2: Logic & Architecture
            </h2>

            <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', color: '#e2e8f0' }}>
                    <Database size={18} color="var(--accent)" />
                    Recommended Data Structures
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                    {recommended_data_structures.map((ds, index) => (
                        <span key={index} style={{
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#c4b5fd',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            border: '1px solid rgba(139, 92, 246, 0.4)'
                        }}>
                            {ds}
                        </span>
                    ))}
                </div>

                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#e2e8f0' }}>Algorithm Explanation</h3>
                <div style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--primary)',
                    lineHeight: 1.6
                }}>
                    <ul style={{ paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {Array.isArray(english_explanation)
                            ? english_explanation.map((point, i) => <li key={i}>{point}</li>)
                            : <li>{english_explanation}</li>}
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Need to see the actual implementation?</p>
                <button onClick={onShowMore} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    Show Code Solutions <ChevronDown size={16} />
                </button>
            </div>
        </div>
    );
};

export default LogicBox;
