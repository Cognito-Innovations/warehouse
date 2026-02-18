import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import * as api from "../src/services/api.services";
import UpdateMawbModal from "../src/components/ShipmentExport/UpdateMawbModal";

jest.spyOn(api, "updateShipmentExport");

describe("UpdateMawbModal", () => {
  test("renders when open", () => {
    render(
      <UpdateMawbModal
        open={true}
        onClose={jest.fn()}
        onUpdate={jest.fn()}
        shipment={{ id: "1", mawb: "" }}
      />
    );

    expect(screen.getByRole("textbox", { name: /MAWB/i })).toBeInTheDocument();
  });

  test("updates MAWB successfully", async () => {
    (api.updateShipmentExport as jest.Mock).mockResolvedValue({});

    const onUpdate = jest.fn();

    render(
      <UpdateMawbModal
        open={true}
        onClose={jest.fn()}
        onUpdate={onUpdate}
        shipment={{ id: "1", mawb: "" }}
      />
    );

    fireEvent.change(screen.getByRole("textbox", { name: /MAWB/i }), {
      target: { value: "999" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(api.updateShipmentExport).toHaveBeenCalled());

    expect(onUpdate).toHaveBeenCalled();
  });
});
