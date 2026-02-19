import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

import * as api from "../src/services/api.services";
import ShipmentExportTable from "../src/components/ShipmentExport/ShipmentExportTable";

jest.mock("../src/services/api.services");

jest.mock(
  "../src/components/ShipmentExport/ShipmentExportFilters",
  () => (props: any) => (
    <div>
      <button
        onClick={() => props.onDateChange(dayjs("2024-01-10"))}
      >
        SetDate1
      </button>

      <button
        onClick={() => props.onDateChange(dayjs("2024-01-11"))}
      >
        SetDate2
      </button>

      <button
        onClick={() => props.onDateChange(dayjs("2024-01-15"))}
      >
        SetNoMatchDate
      </button>
    </div>
  )
);

const date1 = dayjs("2024-01-10").unix();
const date2 = dayjs("2024-01-11").unix();

const baseRow = {
  boxes_count: 5,
  created_by: "admin",
  status: "DRAFT",
};

describe("ShipmentExportTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () => render(
    <MemoryRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ShipmentExportTable />
      </LocalizationProvider>
    </MemoryRouter>
  );

  test("renders shipment rows on successful fetch", async () => {
    (api.getShipmentExports as jest.Mock).mockResolvedValue([
      {
        id: "1",
        export_code: "EX-001",
        created_at: date1,
        mawb: "123",
        ...baseRow,
      },
    ]);

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("EX-001")).toBeInTheDocument()
    );
  });

  test("shows empty state when no shipments returned", async () => {
    (api.getShipmentExports as jest.Mock).mockResolvedValue([]);

    renderPage();

    await waitFor(() =>
      expect(screen.getByText(/no shipments found/i)).toBeInTheDocument()
    );
  });

  test("handles API failure gracefully", async () => {
    (api.getShipmentExports as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    renderPage();

    await waitFor(() =>
      expect(screen.getByText(/no shipments found/i)).toBeInTheDocument()
    );
  });

  test("filters shipments by selected date", async () => {
    (api.getShipmentExports as jest.Mock).mockResolvedValue([
      {
        id: "1",
        export_code: "EX-001",
        created_at: date1,
        mawb: "123",
        ...baseRow,
      },
      {
        id: "2",
        export_code: "EX-002",
        created_at: date2,
        mawb: "456",
        ...baseRow,
      },
    ]);

    renderPage();

    await waitFor(() => screen.getByText("EX-001"));

    fireEvent.click(screen.getByText("SetDate1"));

    await waitFor(() => {
      expect(screen.getByText("EX-001")).toBeInTheDocument();
      expect(screen.queryByText("EX-002")).not.toBeInTheDocument();
    });
  });

  test("shows no shipments when selected date does not match", async () => {
    (api.getShipmentExports as jest.Mock).mockResolvedValue([
      {
        id: "1",
        export_code: "EX-001",
        created_at: date1,
        mawb: "123",
        ...baseRow,
      },
    ]);

    renderPage();

    await waitFor(() => screen.getByText("EX-001"));

    fireEvent.click(screen.getByText("SetNoMatchDate"));

    await waitFor(() =>
      expect(screen.getByText(/no shipments found/i)).toBeInTheDocument()
    );
  });

  test("shows all rows when no date filter applied", async () => {
    (api.getShipmentExports as jest.Mock).mockResolvedValue([
      {
        id: "1",
        export_code: "EX-001",
        created_at: date1,
        mawb: "123",
        ...baseRow,
      },
      {
        id: "2",
        export_code: "EX-002",
        created_at: date2,
        mawb: "456",
        ...baseRow,
      },
    ]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("EX-001")).toBeInTheDocument();
      expect(screen.getByText("EX-002")).toBeInTheDocument();
    });
  });

  test("shows all rows on one page if less than rowsPerPage", async () => {
    (api.getShipmentExports as jest.Mock).mockResolvedValue([
      {
        id: "1",
        export_code: "EX-001",
        created_at: date1,
        mawb: "123",
        ...baseRow,
      },
      {
        id: "2",
        export_code: "EX-002",
        created_at: date1,
        mawb: "456",
        ...baseRow,
      },
    ]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("EX-001")).toBeInTheDocument();
      expect(screen.getByText("EX-002")).toBeInTheDocument();
    });
  });

  test("pagination moves to next page correctly", async () => {
    const manyRows = Array.from({ length: 20 }, (_, i) => ({
      id: `${i}`,
      export_code: `EX-${i}`,
      created_at: date1,
      mawb: "111",
      ...baseRow,
    }));

    (api.getShipmentExports as jest.Mock).mockResolvedValue(manyRows);

    renderPage();

    await waitFor(() => screen.getByText("EX-0"));

    expect(screen.queryByText("EX-15")).not.toBeInTheDocument();

    const nextButton = screen.getByLabelText(/go to next page/i);

    fireEvent.click(nextButton);

    await waitFor(() =>
      expect(screen.getByText("EX-15")).toBeInTheDocument()
    );
  });

  test("pagination respects applied date filter", async () => {
    const mixedData = [
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `${i}`,
        export_code: `EX-${i}`,
        created_at: date1,
        mawb: "111",
        ...baseRow,
      })),
      {
        id: "special",
        export_code: "EX-SPECIAL",
        created_at: date2,
        mawb: "999",
        ...baseRow,
      },
    ];

    (api.getShipmentExports as jest.Mock).mockResolvedValue(mixedData);

    renderPage();

    await waitFor(() => screen.getByText("EX-0"));

    fireEvent.click(screen.getByText("SetDate2"));

    await waitFor(() => {
      expect(screen.getByText("EX-SPECIAL")).toBeInTheDocument();
      expect(screen.queryByText("EX-0")).not.toBeInTheDocument();
    });
  });
});
