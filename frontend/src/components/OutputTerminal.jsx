import React, { useEffect, useRef } from 'react';

// Maps Judge0 status IDs to a colour token
const getStatusStyle = (statusId) => {
    if(!statusId) return "status-neutral";
    if(statusId === 3) return "status-success"; // Accepted
    if(statusId === 6) return "status-error"; // Compilation error
    if([7,8,9,10,11,12].includes(statusId)) return "status-error"; // Runtime error/ TLE / MLE
    return "status-neutral";
};

function OutputTerminal({output, isLoading, onClose}) {
    // bottomRef is a reference to an invisible element placed at the bottom of the terminal so React can automatically scroll to that position whenever new output appears
    const bottomRef = useRef(null);

    // Auto-scroll to bottom whenever output changes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [output]);

    const renderContent = () => {
        // waiting for judge0 response
        if(isLoading) {
            return (
                <div className="terminal-loading">
                    <span className="terminal-spinner" />
                    <span>Compiling and running your code…</span>
                </div>
            );
        }

        // if no output, panel just opened
        if(!output) {
            return <p className="terminal-placeholder">Output will appear here.</p>;
        }

        const {stdout, stderr, compile_output, message, status, time, memory} = output;

        // not executable language info
        if(status?.id === 0) {
            return (
                <p className="terminal-info">
                    ℹ️ {message}
                </p>
            );
        }

        const hasOutput = stdout?.trim();
        const hasError = stderr?.trim() || compile_output?.trim();
        const statusStyle = getStatusStyle(status?.id);

        return (
            <>
                {/* Status bar */}
                <div className={`terminal-status-bar ${statusStyle}`}>
                    <span className="terminal-status-badge">
                        {status?.description ?? 'Unknown'}
                    </span>
                    {time && 
                        <span className="terminal-meta">⏱ {time}s</span>
                    }
                    {memory && 
                        <span className="terminal-meta">💾 {(memory / 1024).toFixed(1)} MB</span>
                    }
                </div>

                {/* Standard output */}
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

                {/* Compile error */}
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

                {/* Standard error or Runtime error */}
                {stderr?.trim() && (
                    <section className="terminal-section">
                        <p className="terminal-section-label terminal-label-error">
                            RUNTIME ERROR / STDERR
                        </p>
                        <pre className="terminal-output terminal-error">{stderr}</pre>
                    </section>
                )}

                {/* Generic message */}
                {message?.trim() && (
                    <section className="terminal-section">
                        <p className="terminal-section-label terminal-label-warn">INFO</p>
                        <pre className="terminal-output terminal-warn">{message}</pre>
                    </section>
                )}

                <div ref={bottomRef} />
            </>
        )
    };

    return (
        <div className="output-terminal">
            <div className="terminal-header">
                <span className="terminal-title">Terminal — Output</span>
                <button
                    className="terminal-close-btn"
                    onClick={onClose}
                    title="Close terminal"
                >
                    ✕
                </button>
            </div>

            <div className="terminal-body">
                {renderContent()}
            </div>
        </div>
    )
}

export default OutputTerminal