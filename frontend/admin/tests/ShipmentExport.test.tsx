import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import * as api from "../src/services/api.services";
import ShipmentExport from "../src/pages/ShipmentExport";

jest.spyOn(api, "getShipmentExports").mockResolvedValue([]);

describe("ShipmentExport Page", () => {
  test("renders navbar and export table", async () => {
    render(
      <MemoryRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ShipmentExport />
        </LocalizationProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Shipment \/ Export/ })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("No shipments found")).toBeInTheDocument();
    });
  });
});
