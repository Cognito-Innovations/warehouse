import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import * as api from "../src/services/api.services";
import ShipmentExportTable from "../src/components/ShipmentExport/ShipmentExportTable";

jest.spyOn(api, "getShipmentExports");

const mockData = [
  {
    id: "1",
    export_code: "EX-001",
    created_at: 1700000000,
    mawb: "12345",
    boxes_count: 10,
    created_by: "admin",
    status: "DRAFT",
  },
];

describe("ShipmentExportTable", () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ShipmentExportTable />
        </LocalizationProvider>
      </MemoryRouter>
    );

  test("fetches and displays data", async () => {
    (api.getShipmentExports as jest.Mock).mockResolvedValue(mockData);

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("EX-001")).toBeInTheDocument()
    );
  });

  test("shows empty state when API returns empty", async () => {
    (api.getShipmentExports as jest.Mock).mockResolvedValue([]);

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("No shipments found")).toBeInTheDocument()
    );
  });

  test("handles API failure gracefully", async () => {
    (api.getShipmentExports as jest.Mock).mockRejectedValue(
      new Error("API error")
    );

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("No shipments found")).toBeInTheDocument()
    );
  });
});
