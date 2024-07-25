import React from 'react';

const Modal = ({ content, onClose }) => {
  return (
    <div
      className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto"
      onClick={onClose}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div
        className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-2xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white p-4">
          {content?.includes('.mp4') || content?.includes('.webm') ? (
            <video
              src={content}
              controls
              className="w-full h-full max-h-[70vh] object-contain"
            />
          ) : (
            <img
              src={content}
              alt="Enlarged View"
              className="w-full h-full max-h-[70vh] object-contain"
            />
          )}
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
