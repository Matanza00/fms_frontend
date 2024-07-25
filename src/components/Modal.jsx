import React, { useEffect } from 'react';

const Modal = ({ title, isOpen, onClose, children }) => {
  useEffect(() => {
    const modalElement = document.getElementById('general_modal');
    if (isOpen) {
      modalElement.showModal();
    } else {
      modalElement.close();
    }
  }, [isOpen]);

  const closeModal = () => {
    onClose && onClose();
  };

  return (
    <>
      <button
        className="btn"
        onClick={() => document.getElementById('general_modal').showModal()}
      >
        Open Modal
      </button>
      <dialog id="general_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="py-4">{children}</div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
