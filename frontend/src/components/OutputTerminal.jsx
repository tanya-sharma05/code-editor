import React, { useRef, useEffect } from 'react';

// Maps Judge0 status IDs to a colour token
const getStatusStyle = (statusId) => {
    if (!statusId) return 'status-neutral';
    if (statusId === 3)  return 'status-success';   // Accepted
    if (statusId === 6)  return 'status-error';     // Compilation Error
    if ([7,8,9,10,11,12].includes(statusId)) return 'status-error';  // Runtime / TLE / MLE
    return 'status-neutral';
};

const OutputTerminal = ({ output, isLoading, onClose }) => {
    const bottomRef = useRef(null);

    // Auto-scroll to bottom whenever output changes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [output]);

    const renderContent = () => {
        // ── Still waiting for Judge0 ──────────────────────
        if (isLoading) {
            return (
                <div className="terminal-loading">
                    <span className="terminal-spinner" />
                    <span>Compiling and running your code…</span>
                </div>
            );
        }

        // ── No output yet (panel just opened) ─────────────
        if (!output) {
            return <p className="terminal-placeholder">Output will appear here.</p>;
        }

        const { stdout, stderr, compile_output, message, status, time, memory } = output;

        // ── Not-executable language message ───────────────
        if (status?.id === 0) {
            return (
                <p className="terminal-info">
                    ℹ️ {message}
                </p>
            );
        }

        const hasOutput       = stdout?.trim();
        const hasError        = stderr?.trim() || compile_output?.trim();
        const statusStyle     = getStatusStyle(status?.id);

        return (
            <>
                {/* ── Status bar ── */}
                <div className={`terminal-status-bar ${statusStyle}`}>
                    <span className="terminal-status-badge">
                        {status?.description ?? 'Unknown'}
                    </span>
                    {time   && <span className="terminal-meta">⏱ {time}s</span>}
                    {memory && <span className="terminal-meta">💾 {(memory / 1024).toFixed(1)} MB</span>}
                </div>

                {/* ── stdout ── */}
                {hasOutput ? (
                    <section className="terminal-section">
                        <p className="terminal-section-label">OUTPUT</p>
                        <pre className="terminal-output">{stdout}</pre>
                    </section>
                ) : (
                    !hasError && (
                        <p className="terminal-placeholder">
                            Program ran successfully with no output.
                        </p>
                    )
                )}

                {/* ── compile error ── */}
                {compile_output?.trim() && (
                    <section className="terminal-section">
                        <p className="terminal-section-label terminal-label-error">
                            COMPILATION ERROR
                        </p>
                        <pre className="terminal-output terminal-error">
                            {compile_output}
                        </pre>
                    </section>
                )}

                {/* ── runtime error / stderr ── */}
                {stderr?.trim() && (
                    <section className="terminal-section">
                        <p className="terminal-section-label terminal-label-error">
                            RUNTIME ERROR / STDERR
                        </p>
                        <pre className="terminal-output terminal-error">{stderr}</pre>
                    </section>
                )}

                {/* ── generic message (e.g. TLE) ── */}
                {message?.trim() && (
                    <section className="terminal-section">
                        <p className="terminal-section-label terminal-label-warn">INFO</p>
                        <pre className="terminal-output terminal-warn">{message}</pre>
                    </section>
                )}

                <div ref={bottomRef} />
            </>
        );
    };

    return (
        <div className="output-terminal">
            {/* ── Header ── */}
            <div className="terminal-header">
                <div className="terminal-dots">
                    <span className="dot dot-red"   />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green"  />
                </div>
                <span className="terminal-title">Terminal — Output</span>
                <button
                    className="terminal-close-btn"
                    onClick={onClose}
                    title="Close terminal"
                >
                    ✕
                </button>
            </div>

            {/* ── Body ── */}
            <div className="terminal-body">
                {renderContent()}
            </div>
        </div>
    );
};

export default OutputTerminal;