import React from 'react';
import ReactMarkdown from 'react-markdown';

const ExplainationPanel = ({isLoading, response, onClose}) => {
    return (
        <aside className="explanation-panel">
            <div className="panel-header">
                <h3>AI Analysis</h3>
                <button onClick={onClose} className="btn close-btn">
                    &times;
                </button>
            </div>

            <div className="panel-body">
                {isLoading && <p>Analyzing your code...</p>}
                {!isLoading && response && (
                    <>
                        {response.hasError ? (
                            <div className="error-section">
                                <h4>Bug Analysis:</h4>
                                <p>{response.errorAnalysis}</p>
                                <h4>Suggested Fix:</h4>
                                <pre className="code-block">
                                    <code>{response.correctedCode}</code>
                                </pre>
                            </div>
                        ) : (
                            <div className="no-error-section">
                                <h4>Analysis:</h4>
                                <p>No bugs or syntax errors found.</p>
                            </div>
                        )}

                        <h4>Explanation:</h4>
                        <ReactMarkdown>{response.explanation}</ReactMarkdown>

                        <h4>Key Concepts:</h4>
                        <div className="concept-tags">
                            {response.keyConcepts.map((concept, index) => (
                                <span key={index} className="concept-tag">
                                    {concept}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
};

export default ExplainationPanel;