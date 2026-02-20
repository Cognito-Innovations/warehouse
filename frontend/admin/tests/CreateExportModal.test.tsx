import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import * as api from "../src/services/api.services";
import CreateExportModal from "../src/components/ShipmentExport/CreateExportModal";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.spyOn(api, "createShipmentExport");

describe("CreateExportModal", () => {
  const renderWithRouter = (ui: React.ReactElement) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal with default No of Boxes value", async () => {
    renderWithRouter(
      <CreateExportModal open={true} onClose={jest.fn()} onCreate={jest.fn()} />
    );

    const input = await screen.findByRole("spinbutton", { name: /No of Boxes/i });
    expect(input).toHaveValue(1);
  });

  test("creates export successfully and navigates when id is returned", async () => {
    (api.createShipmentExport as jest.Mock).mockResolvedValue({ id: "123" });
    const onCreate = jest.fn();
    const onClose = jest.fn();

    renderWithRouter(
      <CreateExportModal open={true} onClose={onClose} onCreate={onCreate} />
    );

    const input = await screen.findByRole("spinbutton", { name: /No of Boxes/i });
    fireEvent.change(input, { target: { value: "5" } });

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(api.createShipmentExport).toHaveBeenCalledWith(
        expect.objectContaining({
          boxes_count: 5,
          created_by: "admin-123",
        })
      );
    });

    expect(onCreate).toHaveBeenCalledWith({ id: "123" });
    expect(mockedNavigate).toHaveBeenCalledWith("/shipment/export/123");
    expect(onClose).toHaveBeenCalled();
  });

  test("does not navigate if API returns no id", async () => {
    (api.createShipmentExport as jest.Mock).mockResolvedValue({});

    const onCreate = jest.fn();
    const onClose = jest.fn();

    renderWithRouter(
      <CreateExportModal open={true} onClose={onClose} onCreate={onCreate} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() =>
      expect(api.createShipmentExport).toHaveBeenCalled()
    );

    expect(mockedNavigate).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  test("shows error toast and closes modal when API fails", async () => {
    (api.createShipmentExport as jest.Mock).mockRejectedValue(
      new Error("API error")
    );

    const onClose = jest.fn();

    renderWithRouter(
      <CreateExportModal open={true} onClose={onClose} onCreate={jest.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() =>
      expect(api.createShipmentExport).toHaveBeenCalled()
    );

    expect(toast.error).toHaveBeenCalledWith("Failed to create export");
    expect(onClose).toHaveBeenCalled();
  });

  test("disables Save button and shows loader while saving", async () => {
    let resolvePromise: any;
    (api.createShipmentExport as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    renderWithRouter(
      <CreateExportModal open={true} onClose={jest.fn()} onCreate={jest.fn()} />
    );

    const button = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    resolvePromise({ id: "999" });

    await waitFor(() =>
      expect(button).not.toBeDisabled()
    );
  });

  test("resets No of Boxes to default when modal closes", async () => {
    const onClose = jest.fn();

    renderWithRouter(
      <CreateExportModal open={true} onClose={onClose} onCreate={jest.fn()} />
    );

    const input = await screen.findByRole("spinbutton", { name: /No of Boxes/i });

    fireEvent.change(input, { target: { value: "10" } });
    expect(input).toHaveValue(10);

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());

    expect(input).toHaveValue(1);
  });
});
