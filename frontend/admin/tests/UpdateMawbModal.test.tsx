import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import * as api from "../src/services/api.services";
import UpdateMawbModal from "../src/components/ShipmentExport/UpdateMawbModal";
import { ShipmentExportRow } from "../src/components/ShipmentExport/ShipmentExportTableBody";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.spyOn(api, "updateShipmentExport");

describe("UpdateMawbModal", () => {
  const defaultShipment: ShipmentExportRow = {
    id: "1",
    export_code: "EXP-001",
    created_at: Date.now(),
    mawb: "",
    boxes_count: 5,
    created_by: "Admin",
    status: "PENDING",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders MAWB field when open", () => {
    render(
      <UpdateMawbModal
        open={true}
        onClose={jest.fn()}
        onUpdateRow={jest.fn()}
        shipment={defaultShipment}
      />
    );

    expect(screen.getByRole("textbox", { name: /MAWB/i })).toBeInTheDocument();
  });

  test("accepts string value in MAWB field", () => {
    render(
      <UpdateMawbModal
        open={true}
        onClose={jest.fn()}
        onUpdateRow={jest.fn()}
        shipment={defaultShipment}
      />
    );

    const input = screen.getByRole("textbox", { name: /MAWB/i });

    fireEvent.change(input, { target: { value: "ABC123" } });

    expect(input).toHaveValue("ABC123");
  });

  test("accepts 'NaN' string value in MAWB field", () => {
    render(
      <UpdateMawbModal
        open={true}
        onClose={jest.fn()}
        onUpdateRow={jest.fn()}
        shipment={defaultShipment}
      />
    );

    const input = screen.getByRole("textbox", { name: /MAWB/i });

    fireEvent.change(input, { target: { value: "NaN" } });

    expect(input).toHaveValue("NaN");
  });

  test("disables save button when MAWB is empty", () => {
    render(
      <UpdateMawbModal
        open={true}
        onClose={jest.fn()}
        onUpdateRow={jest.fn()}
        shipment={defaultShipment}
      />
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  test("does not call API if shipment is null", async () => {
    render(
      <UpdateMawbModal
        open={true}
        onClose={jest.fn()}
        onUpdateRow={jest.fn()}
        shipment={null}
      />
    );

    const input = screen.getByRole("textbox", { name: /MAWB/i });

    fireEvent.change(input, { target: { value: "123" } });

    fireEvent.click(screen.getByText("Save"));

    expect(api.updateShipmentExport).not.toHaveBeenCalled();
  });

  test("shows 'Saving...' when saving is true", async () => {
    (api.updateShipmentExport as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <UpdateMawbModal
        open={true}
        onClose={jest.fn()}
        onUpdateRow={jest.fn()}
        shipment={defaultShipment}
      />
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "999" },
    });

    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Saving...")).toBeInTheDocument();
  });

  test("updates MAWB successfully", async () => {
    (api.updateShipmentExport as jest.Mock).mockResolvedValue({});

    const onUpdateRow = jest.fn();
    const onClose = jest.fn();

    render(
      <UpdateMawbModal
        open={true}
        onClose={onClose}
        onUpdateRow={onUpdateRow}
        shipment={defaultShipment}
      />
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "999" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(api.updateShipmentExport).toHaveBeenCalledWith("1", { mawb: "999" })
    );

    expect(onUpdateRow).toHaveBeenCalledWith({
      ...defaultShipment,
      mawb: "999",
    });

    expect(onClose).toHaveBeenCalled();
  });

  test("shows toast when API fails", async () => {
    (api.updateShipmentExport as jest.Mock).mockRejectedValue(
      new Error("error")
    );

    render(
      <UpdateMawbModal
        open={true}
        onClose={jest.fn()}
        onUpdateRow={jest.fn()}
        shipment={defaultShipment}
      />
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "999" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to update MAWB")
    );
  });

  test("does not close modal while saving", async () => {
    (api.updateShipmentExport as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const onClose = jest.fn();

    render(
      <UpdateMawbModal
        open={true}
        onClose={onClose}
        onUpdateRow={jest.fn()}
        shipment={defaultShipment}
      />
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "999" },
    });

    fireEvent.click(screen.getByText("Save"));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).not.toHaveBeenCalled();
  });
});
