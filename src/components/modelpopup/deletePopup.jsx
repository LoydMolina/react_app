import React from "react";

const DeleteModal = ({ Name, deleteAction }) => {
  return (
    <>
      {/* Delete Modal */}
      <div className="modal custom-modal fade" id="delete" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>{Name}</h3>
                <p>Are you sure you want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
              <div className="d-flex justify-content-center">
                <div className="row">
                  <div className="col-6">
                    <button type="button" className="btn btn-primary continue-btn" onClick={deleteAction} data-bs-dismiss="modal">
                      Delete
                    </button>
                  </div>
                  <div className="col-6">
                    <button type="button" className="btn btn-primary cancel-btn" data-bs-dismiss="modal">
                      Cancel
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
    </>
  );
};

export default DeleteModal;
