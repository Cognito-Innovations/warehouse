import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import ShipmentsTable from "../src/components/Shipments/ShipmentsTable";

const mockShipments = [
  {
    id: "1",
    status: "SHIP_REQUEST",
    user: {
      name: "Test User",
      suite_no: "A101",
    },
    invoice: {
      status: "PENDING",
    },
  },
  {
    id: "2",
    status: "READY_TO_SHIP",
    user: {
      name: "Test User 1",
      suite_no: "B202",
    },
    invoice: {
      status: "PAID",
    },
  },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("ShipmentsTable Component", () => {
  test("shows loading state", () => {
    renderWithRouter(
      <ShipmentsTable shipments={[]} status="All" loading={true} />
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("shows empty state", () => {
    renderWithRouter(
      <ShipmentsTable shipments={[]} status="All" loading={false} />
    );

    expect(screen.getByText("No shipments found")).toBeInTheDocument();
  });

  test("filters shipments correctly", () => {
    renderWithRouter(
      <ShipmentsTable
        shipments={mockShipments}
        status="SHIP_REQUEST"
        loading={false}
      />
    );

    expect(screen.getByText("SHIP_REQUEST")).toBeInTheDocument();
  });
});
