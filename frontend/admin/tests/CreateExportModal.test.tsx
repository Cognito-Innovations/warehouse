import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as api from "../src/services/api.services";
import CreateExportModal from "../src/components/ShipmentExport/CreateExportModal";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.spyOn(api, "createShipmentExport");

describe("CreateExportModal", () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  test("renders correctly", async () => {
    renderWithRouter(
      <CreateExportModal open={true} onClose={jest.fn()} onUpdate={jest.fn()} />
    );

    const input = await screen.findByRole("spinbutton", { name: /No of Boxes/i });
    expect(input).toBeInTheDocument();
  });

  test("creates export successfully", async () => {
    (api.createShipmentExport as jest.Mock).mockResolvedValue({ id: "123" });
    const onUpdate = jest.fn();
    const onClose = jest.fn();

    renderWithRouter(
      <CreateExportModal open={true} onClose={onClose} onUpdate={onUpdate} />
    );

    const input = await screen.findByRole("spinbutton", { name: /No of Boxes/i });
    fireEvent.change(input, { target: { value: "5" } });

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => expect(api.createShipmentExport).toHaveBeenCalled());
    expect(onUpdate).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith("/shipment/export/123");
  });

  test("handles API failure", async () => {
    (api.createShipmentExport as jest.Mock).mockRejectedValue(new Error("error"));
    const onClose = jest.fn();

    renderWithRouter(
      <CreateExportModal open={true} onClose={onClose} onUpdate={jest.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => expect(api.createShipmentExport).toHaveBeenCalled());
    expect(onClose).toHaveBeenCalled();
  });
});
