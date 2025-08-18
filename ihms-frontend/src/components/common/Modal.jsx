// src/components/common/Modal.jsx
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg relative p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        {/* Modal content (form, etc.) */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
