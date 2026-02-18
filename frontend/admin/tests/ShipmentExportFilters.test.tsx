import { render, screen, fireEvent, within } from "@testing-library/react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MemoryRouter } from "react-router-dom";

import ShipmentExportFilters from "../src/components/ShipmentExport/ShipmentExportFilters";

const renderWithLocalization = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {ui}
      </LocalizationProvider>
    </MemoryRouter>
  );
};

describe("ShipmentExportFilters", () => {
  test("renders date picker and create button", () => {
    renderWithLocalization(
      <ShipmentExportFilters
        selectedDate={null}
        onDateChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: /Create Export/i })
    ).toBeInTheDocument();
  });

  test("opens modal when create clicked", () => {
    renderWithLocalization(
      <ShipmentExportFilters
        selectedDate={null}
        onDateChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    const createButton = screen.getByRole("button", { name: /Create Export/i });
    fireEvent.click(createButton);

    const modal = screen.getByRole("dialog");
    expect(within(modal).getByText(/Create Export/i)).toBeInTheDocument();
  });

  test("clears selected date", () => {
    const onDateChange = jest.fn();

    renderWithLocalization(
      <ShipmentExportFilters
        selectedDate={dayjs()}
        onDateChange={onDateChange}
        onUpdate={jest.fn()}
      />
    );

    const closeButtons = screen.getAllByRole("button");
    fireEvent.click(closeButtons[1]);

    expect(onDateChange).toHaveBeenCalledWith(null);
  });
});
