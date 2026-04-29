import React from 'react'

const Modal = () => {
  return (
    <div className="modal-overlay">
        <div className="modal-content">
            <button className="modal-close-btn">
                &times;
            </button>
        </div>
    </div>
  )
}

export default Modal