import React from 'react'

function OutputTerminal({output, isLoading, onClose}) {
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

        {/* <div className="terminal-body">
            {renderContent()}
        </div> */}
    </div>
  )
}

export default OutputTerminal