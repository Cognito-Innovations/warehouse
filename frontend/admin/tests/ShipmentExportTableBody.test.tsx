import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ShipmentExportTableBody from "../src/components/ShipmentExport/ShipmentExportTableBody";

const rows = [
  {
    id: "1",
    export_code: "EX-001",
    created_at: 1700000000,
    boxes_count: 5,
    created_by: "admin",
    status: "DRAFT",
  },
];

describe("ShipmentExportTableBody", () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  test("renders rows correctly", () => {
    renderWithRouter(
      <table>
        <ShipmentExportTableBody rows={rows} loading={false} onUpdate={jest.fn()} />
      </table>
    );

    expect(screen.getByText("EX-001")).toBeInTheDocument();
  });

  test("shows loading spinner", () => {
    renderWithRouter(
      <table>
        <ShipmentExportTableBody rows={[]} loading={true} onUpdate={jest.fn()} />
      </table>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("shows empty state", () => {
    renderWithRouter(
      <table>
        <ShipmentExportTableBody rows={[]} loading={false} onUpdate={jest.fn()} />
      </table>
    );

    expect(screen.getByText("No shipments found")).toBeInTheDocument();
  });
});
