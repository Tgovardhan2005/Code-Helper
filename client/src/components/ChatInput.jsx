import React, { useState } from 'react';
import { Send, Code } from 'lucide-react';

const ChatInput = ({ onSubmit, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSubmit(input);
        }
    };

    const handleKeyDown = (e) => {
        // Submit on Ctrl+Enter or Cmd+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="glass-panel">
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
                    <Code size={20} color="var(--primary)" />
                    <h2 className="section-title" style={{ margin: 0, fontSize: '1.25rem' }}>Describe your doubt or paste code</h2>
                </div>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="E.g., How do I reverse a linked list? Or paste your buggy code here... (Ctrl+Enter to submit)"
                    disabled={isLoading}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                    {isLoading && <span style={{ color: 'var(--text-muted)' }}>Analyzing problem...</span>}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={!input.trim() || isLoading}
                    >
                        {isLoading ? 'Solving...' : 'Get Hints'}
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
