import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, CheckCircle, Zap } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

const renderMatrix = (matrix, pointers) => {
    return (
        <div className="viz-matrix-container">
            <AnimatePresence mode="popLayout">
                {matrix.map((row, rIdx) => (
                    <motion.div key={`row-${rIdx}`} className="viz-matrix-row" layout>
                        {row.map((val, cIdx) => {
                            let isActive = false;
                            let ptrLabels = [];
                            if (pointers) {
                                Object.entries(pointers).forEach(([k, p]) => {
                                    if (Array.isArray(p) && p[0] === rIdx && p[1] === cIdx) {
                                        isActive = true;
                                        ptrLabels.push(k);
                                    }
                                });
                            }
                            return (
                                <motion.div
                                    key={`cell-${rIdx}-${cIdx}`}
                                    className="viz-matrix-cell"
                                    animate={{ borderColor: isActive ? '#f59e0b' : '#0284c7', scale: isActive ? 1.08 : 1 }}
                                    style={{ position: 'relative' }}
                                >
                                    {ptrLabels.length > 0 && (
                                        <div style={{ position: 'absolute', top: '-18px', color: '#f59e0b', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                                            {ptrLabels.join(', ')}
                                        </div>
                                    )}
                                    {val}
                                </motion.div>
                            )
                        })}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

const flattenTree = (node, depth, x, y, dx, nodes, edges) => {
    if (!node) return;
    nodes.push({ ...node, x, y });

    if (node.left) {
        const childX = x - dx;
        const childY = y + 70;
        edges.push({ x1: x, y1: y, x2: childX, y2: childY });
        flattenTree(node.left, depth + 1, childX, childY, dx / 2, nodes, edges);
    }
    if (node.right) {
        const childX = x + dx;
        const childY = y + 70;
        edges.push({ x1: x, y1: y, x2: childX, y2: childY });
        flattenTree(node.right, depth + 1, childX, childY, dx / 2, nodes, edges);
    }
};

const renderTree = (rootNode, pointers) => {
    if (!rootNode) return null;

    const nodes = [];
    const edges = [];

    // Calculate required dimensions
    const getDepth = (n) => n ? 1 + Math.max(getDepth(n.left), getDepth(n.right)) : 0;
    const depth = getDepth(rootNode);

    const width = Math.max(320, Math.pow(2, depth - 1) * 60 + 40);
    const height = Math.max(200, depth * 70 + 40);

    flattenTree(rootNode, 0, width / 2, 40, width / 4, nodes, edges);

    return (
        <div className="viz-graph-container" style={{ width: `${width}px`, height: `${height}px`, margin: '2rem auto' }}>
            <svg className="viz-graph-svg" style={{ width: '100%', height: '100%' }}>
                {edges.map((edge, i) => (
                    <line
                        key={`tedge-${i}`}
                        x1={edge.x1} y1={edge.y1}
                        x2={edge.x2} y2={edge.y2}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="3"
                    />
                ))}
            </svg>
            {nodes.map(n => {
                let isActive = false;
                let ptrLabels = [];
                if (pointers) {
                    Object.entries(pointers).forEach(([k, v]) => {
                        if (v === n.id || v === n.val) {
                            isActive = true;
                            ptrLabels.push(k);
                        }
                    });
                }
                return (
                    <motion.div
                        key={n.id || Math.random()}
                        className="viz-tree-node"
                        style={{ position: 'absolute', left: n.x - 22.5, top: n.y - 22.5, margin: 0 }}
                        animate={{ borderColor: isActive ? '#f59e0b' : '#059669', scale: isActive ? 1.15 : 1 }}
                        layout
                    >
                        {ptrLabels.length > 0 && (
                            <div style={{ position: 'absolute', top: '-22px', color: '#f59e0b', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                                {ptrLabels.join(', ')}
                            </div>
                        )}
                        {n.val}
                    </motion.div>
                );
            })}
        </div>
    );
};



const Visualizer = ({ vizData }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeLang, setActiveLang] = useState('python');
    const [activeStrategy, setActiveStrategy] = useState('optimal');
    const [activeTestCase, setActiveTestCase] = useState(0);

    if (!vizData) return null;

    // Support both the old schema (directly having steps) and the new schema (having brute_force/optimal)
    const strategyData = vizData[activeStrategy] || vizData;

    // Fallback: If test_cases exists use that, otherwise look for steps directly (legacy)
    const hasTestCases = strategyData.test_cases && strategyData.test_cases.length > 0;
    const steps = hasTestCases ? (strategyData.test_cases[activeTestCase]?.steps || []) : (strategyData.steps || []);

    const { code_snippets, code_snippet } = strategyData;
    const stepData = steps.length > 0 ? (steps[currentStep] || steps[0]) : null;

    // Detect if we have multi-language code snippets
    const isMultiLang = !!code_snippets && Object.keys(code_snippets).length > 0;

    // Fallback safely to single code_snippet if multi-lang is not yet generated
    const currentCodeStr = isMultiLang
        ? (code_snippets[activeLang] || code_snippets['python'] || Object.values(code_snippets)[0])
        : code_snippet;

    // Detect if we have multi-language highlight lines
    const currentHighlightLine = stepData.highlight_lines
        ? (stepData.highlight_lines[activeLang] || stepData.highlight_lines['python'] || Object.values(stepData.highlight_lines)[0])
        : stepData.highlight_line;

    // Determine syntax highlighter language
    const syntaxLang = activeLang === 'c' || activeLang === 'cpp' ? 'cpp' : activeLang === 'js' ? 'javascript' : activeLang;

    useEffect(() => {
        let timer;
        if (isPlaying) {
            if (currentStep < steps.length - 1) {
                timer = setTimeout(() => {
                    setCurrentStep(c => c + 1);
                }, 1500); // slightly slower pacing purely so motion animations can finish cleanly
            } else {
                setIsPlaying(false);
            }
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, steps.length]);

    // Reset current step when switching strategies to prevent out of bounds errors
    useEffect(() => {
        setCurrentStep(0);
        setIsPlaying(false);
        setActiveTestCase(0);
    }, [activeStrategy, activeLang]);

    // Reset current step when switching test cases
    useEffect(() => {
        setCurrentStep(0);
        setIsPlaying(false);
    }, [activeTestCase]);

    const hasMultipleStrategies = !!vizData.brute_force && !!vizData.optimal;

    return (
        <div className="glass-panel tier-section" style={{ animationDelay: '0.6s' }}>
            <h2 className="section-title">
                Step 4: Interactive Visualization
            </h2>

            {hasMultipleStrategies && (
                <div className="tabs" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                    <button
                        className={`tab ${activeStrategy === 'brute_force' ? 'active' : ''}`}
                        onClick={() => setActiveStrategy('brute_force')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <CheckCircle size={16} /> Brute Force
                    </button>
                    <button
                        className={`tab ${activeStrategy === 'optimal' ? 'active' : ''}`}
                        onClick={() => setActiveStrategy('optimal')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <Zap size={16} /> Optimal Approach
                    </button>
                </div>
            )}

            {isMultiLang && (
                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem', marginTop: hasMultipleStrategies ? '0.8rem' : '1.5rem', flexWrap: 'wrap' }}>
                    {Object.keys(code_snippets).map((lang) => (
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

            {hasTestCases && strategyData.test_cases.length > 1 && (
                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {strategyData.test_cases.map((tc, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveTestCase(idx)}
                            className={`viz-test-case-btn ${activeTestCase === idx ? 'active' : ''}`}
                        >
                            {tc.input_label || `Test Case ${idx + 1}`}
                            {tc.input_str && (
                                <span className="viz-test-case-input">
                                    ({tc.input_str})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {!stepData ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    No visualization trace generated for this particular test case or strategy approach.
                </div>
            ) : (
                <>
                    <div className="viz-layout">
                        {/* Code Panel */}
                        <div className="viz-code-panel">
                            <div className="viz-panel-header">Execution Trace</div>
                            <div className="viz-code-lines" style={{ padding: 0 }}>
                                <SyntaxHighlighter
                                    language={syntaxLang}
                                    style={vscDarkPlus}
                                    wrapLines={true}
                                    showLineNumbers={true}
                                    lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#858585', textAlign: 'right' }}
                                    lineProps={lineNumber => {
                                        const style = { display: 'block', padding: '0 10px', fontSize: '0.85rem', transition: 'background-color 0.3s ease' };
                                        if (lineNumber === currentHighlightLine) {
                                            style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                                            style.borderLeft = '3px solid #10b981';
                                        } else {
                                            style.borderLeft = '3px solid transparent';
                                        }
                                        return { style };
                                    }}
                                    customStyle={{
                                        margin: 0,
                                        background: 'transparent',
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {currentCodeStr || ''}
                                </SyntaxHighlighter>
                            </div>
                        </div>

                        {/* Data Panel */}
                        <div className="viz-data-panel">
                            <div className="viz-panel-header">Data State</div>

                            <div className="viz-description">
                                {stepData.description}
                            </div>

                            {stepData.primary_array && stepData.primary_array.length > 0 && (
                                <div className="viz-array-container">
                                    <AnimatePresence mode="popLayout">
                                        {stepData.primary_array.map((val, i) => {
                                            const ptrsTop = [];
                                            const ptrsBottom = [];

                                            // Identify any pointers pointing to this specific array index 'i'
                                            Object.entries(stepData.pointers || {}).forEach(([ptrName, idx], pIndex) => {
                                                if (idx === i) {
                                                    if (pIndex % 2 === 0) ptrsBottom.push(ptrName);
                                                    else ptrsTop.push(ptrName);
                                                }
                                            });

                                            // Create a unique key tracking the value but also position
                                            // If we are swapping elements, a more complex keyed algorithm is needed, 
                                            // but we assume standard array index updates here. 
                                            // Framer motion uses Layout ID for magical continuous animations.
                                            return (
                                                <motion.div
                                                    key={i}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                    className="array-block-wrapper"
                                                >
                                                    <div className="array-pointers top">
                                                        {ptrsTop.map(p => (
                                                            <motion.div
                                                                layoutId={`ptr-${p}`}
                                                                key={`top-${p}`}
                                                                className="ptr-label"
                                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                            >
                                                                {p}
                                                            </motion.div>
                                                        ))}
                                                    </div>

                                                    <motion.div
                                                        className="array-block"
                                                        layout
                                                        animate={{
                                                            y: (ptrsTop.length > 0 || ptrsBottom.length > 0) ? -5 : 0,
                                                            borderColor: (ptrsTop.length > 0 || ptrsBottom.length > 0) ? '#f59e0b' : '#0284c7'
                                                        }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    >
                                                        {typeof val === 'object' ? JSON.stringify(val) : val}
                                                    </motion.div>

                                                    <div className="array-pointers bottom">
                                                        {ptrsBottom.map(p => (
                                                            <motion.div
                                                                layoutId={`ptr-${p}`}
                                                                key={`bot-${p}`}
                                                                className="ptr-label"
                                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                            >
                                                                {p}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}

                            {stepData.matrix && stepData.matrix.length > 0 && renderMatrix(stepData.matrix, stepData.pointers)}

                            {stepData.tree && (
                                <div className="viz-tree-container">
                                    {renderTree(stepData.tree, stepData.pointers)}
                                </div>
                            )}



                            {stepData.variables && Object.keys(stepData.variables).length > 0 && (
                                <div className="viz-variables">
                                    {Object.entries(stepData.variables).map(([k, v]) => (
                                        <motion.div
                                            key={k}
                                            className="viz-var-card"
                                            layout
                                        >
                                            <span className="viz-var-name">{k}:</span>
                                            <motion.span
                                                key={v} // force re-animate on value change
                                                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                className="viz-var-value"
                                            >
                                                {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                            </motion.span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Player Controls */}
                    <div className="viz-player">
                        <button className="player-btn" onClick={() => setCurrentStep(0)} disabled={currentStep === 0} title="Reset">
                            <RotateCcw size={16} />
                        </button>
                        <button className="player-btn" onClick={() => setCurrentStep(c => Math.max(0, c - 1))} disabled={currentStep === 0} title="Step Back">
                            <SkipBack size={16} />
                        </button>
                        <button className="player-btn play-btn" onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? "Pause" : "Play"}>
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button className="player-btn" onClick={() => setCurrentStep(c => Math.min(steps.length - 1, c + 1))} disabled={currentStep === steps.length - 1} title="Step Forward">
                            <SkipForward size={16} />
                        </button>

                        <div className="viz-progress-container">
                            <div className="viz-progress-bar" style={{ width: `${(currentStep / Math.max(1, steps.length - 1)) * 100}%` }}></div>
                        </div>

                        <div className="viz-step-counter">
                            {currentStep + 1} / {steps.length}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Visualizer;
