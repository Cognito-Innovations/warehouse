import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SearchFilters from "../src/components/Shipments/SearchFilters";

describe("SearchFilters Component", () => {
  test("changes status via dropdown", async () => {
    const setStatus = jest.fn();

    render(
      <SearchFilters
        status="All"
        setStatus={setStatus}
        shipments={[]}
        loading={false}
      />
    );

    await userEvent.click(screen.getByLabelText("Status"));
    await userEvent.click(screen.getByText(/Ready to Ship/i));

    expect(setStatus).toHaveBeenCalled();
  });

  test("shows clear chip when status selected", () => {
    render(
      <SearchFilters
        status="SHIP_REQUEST"
        setStatus={jest.fn()}
        shipments={[]}
        loading={false}
      />
    );

    expect(screen.getByText("SHIP_REQUEST")).toBeInTheDocument();
  });
});
