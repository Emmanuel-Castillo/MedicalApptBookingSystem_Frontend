interface ModalProps {
  title: string;
  body: string | React.ReactElement;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean
}

function Modal({ onConfirm, onCancel, title, body, confirmText, loading }: ModalProps) {
  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" data-testid={"modal-title"}>{title}</h5>
          </div>
          <div className="modal-body" data-testid={"modal-body"}>{loading ? "Loading..." : body}</div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={onConfirm}
                  disabled={loading}
                  data-testid={"modal-confirmBtn"}
                >
                  {confirmText}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={onCancel}
                  disabled={loading}
                  data-testid={"modal-cancelBtn"}
                >
                  Cancel
                </button>
              </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
