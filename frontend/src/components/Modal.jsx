import React from 'react'

// Reusable Modal component
// Props:
// isOpen -> controls whether modal is visible or hidden
// onClose -> function used to close the modal
// children -> content passed inside the Modal component
function Modal({isOpen, onClose, children}) {
    // If modal is not open, render nothing on the screen
    if(!isOpen) return null;

    return (
        // Background overlay of modal, clicking on this area will close the modal
        <div className="modal-overlay" onClick={onClose}>
            {/* 
                stopPropagation prevents click event from reaching the parent overlay
            */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    )
}

export default Modal