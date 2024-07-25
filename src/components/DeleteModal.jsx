const DeleteModal = ({ deleteModule, handleDelete }) => {
  return (
    <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle ">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Confirmation</h3>
        <p className="py-4">{`Are you sure you want to delete this ${deleteModule}?`}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              type="submit"
              className="btn transition-all duration-100 bg-red-600 hover:bg-red-800 min-w-7 w-20 text-white mr-3"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button className="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteModal;
