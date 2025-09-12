import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "../../components/Modal";

const cancelCallback = jest.fn();
const confirmCallback = jest.fn();
function renderModal(
  body: string | React.ReactElement = "This is the modal's body",
  isLoading?: boolean
) {
  return (
    <Modal
      title="Example title"
      body={body}
      confirmText="Confirmation text"
      onCancel={cancelCallback}
      onConfirm={confirmCallback}
      loading={isLoading}
    />
  );
}

describe("Modal", () => {
  it("renders title, body, and confirmText inside the Modal", () => {
    render(renderModal());

    const title = screen.queryByTestId("modal-title"); // Assert title is present
    expect(title).toBeTruthy();
    expect(title).toHaveTextContent("Example title");

    const body = screen.queryByTestId("modal-body"); // Assert body is present
    expect(body).toBeTruthy();
    expect(body).toHaveTextContent("This is the modal's body");

    const confirmText = screen.queryByTestId("modal-confirmBtn"); // Assert confirmText is present
    expect(confirmText).toBeTruthy();
    expect(confirmText).toHaveTextContent("Confirmation text");
  });

  it("renders ReactElement inside the body of Modal", () => {
    const reactElement: React.ReactElement = <h1 data-testid={"reactElement"}>This is a react element</h1>;
    render(renderModal(reactElement))
    expect(screen.getByTestId("reactElement")).toBeInTheDocument()
  });

  it("renders loading body while the Modal has its loading property set", () => {
    render(renderModal("", true));
    expect(screen.getByTestId("modal-body")).toHaveTextContent("Loading...");
  });

  it("invokes callback when clicking confirmation button", () => {
    render(renderModal());
    const button = screen.getByTestId("modal-confirmBtn");
    fireEvent.click(button);                      // Click the confirmation button
    expect(confirmCallback).toHaveBeenCalled();   // Assert the confirmCallback has been called
  });

  it("invokes callback when clicking the cancel button", () => {
    render(renderModal());
    const button = screen.getByTestId("modal-cancelBtn");
    fireEvent.click(button);                    // Click the cancel button
    expect(cancelCallback).toHaveBeenCalled();  // Assert the cancelCallback has been called
  });
});
