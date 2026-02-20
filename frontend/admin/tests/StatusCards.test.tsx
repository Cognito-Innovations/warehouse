import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import StatusCards from "../src/components/Shipments/StatusCards";

const mockShipments = [
  { id: "1", status: "SHIP_REQUEST" },
  { id: "2", status: "SHIP_REQUEST" },
  { id: "3", status: "READY_TO_SHIP" },
];

describe("StatusCards Component", () => {
  test("renders correct counts", () => {
    render(
      <StatusCards
        shipments={mockShipments}
        onSelectStatus={jest.fn()}
        currentStatus="All"
      />
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("calls onSelectStatus when card clicked", async () => {
    const onSelectStatus = jest.fn();

    render(
      <StatusCards
        shipments={mockShipments}
        onSelectStatus={onSelectStatus}
        currentStatus="All"
      />
    );

    await userEvent.click(screen.getByText("Ship Request"));
    expect(onSelectStatus).toHaveBeenCalled();
  });
});
