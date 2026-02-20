import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import CommonTable from "../src/components/common/CommonTable";

jest.mock("../src/components/common/CommonTableBody", () => ({
  __esModule: true,
  default: jest.fn(({ rows }) => (
    <tbody data-testid="mock-table-body">
      {rows.map((row: any) => (
        <tr key={row.id}>
          <td>{row.name}</td>
        </tr>
      ))}
    </tbody>
  )),
}));

const columns = [
  {
    header: "Name",
    cell: (row: any) => <span>{row.name}</span>,
    width: "50%",
  },
];

const rows = [
  { id: "1", name: "Test User 1", status: "Active" },
  { id: "2", name: "Test User 2", status: "Inactive" },
  { id: "3", name: "Test User 3", status: "Active" },
];

const defaultProps = {
  rows,
  columns,
  loading: false,
  noDataMessage: "No data",
  getIdentifier: (r: any) => r.id,
  getRowStatus: (r: any) => r.status,
};

describe("CommonTable Component", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders table header correctly", () => {
    render(<CommonTable {...defaultProps} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  test("renders all rows when data is provided", () => {
    render(<CommonTable {...defaultProps} />);

    expect(screen.getByText("Test User 1")).toBeInTheDocument();
    expect(screen.getByText("Test User 2")).toBeInTheDocument();
  });

  test("displays loading spinner when loading is true", () => {
    render(<CommonTable {...defaultProps} rows={[]} loading={true} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("shows no data message when there are no rows and not loading", () => {
    render(<CommonTable {...defaultProps} rows={[]} />);

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  test("shows loading spinner instead of no data message when loading is true", () => {
    render(<CommonTable {...defaultProps} rows={[]} loading={true} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText("No data")).not.toBeInTheDocument();
  });

  test("filters rows based on selected status", async () => {
    render(
      <CommonTable
        {...defaultProps}
        filters={{
          statusOptions: [
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ],
        }}
      />
    );

    fireEvent.mouseDown(screen.getByText("Status: All"));

    fireEvent.click(await screen.findByRole("option", { name: "Active" }));

    expect(screen.getByText("Test User 1")).toBeInTheDocument();
    expect(screen.getByText("Test User 3")).toBeInTheDocument();
    expect(screen.queryByText("Test User 2")).not.toBeInTheDocument();
  });

  test("calls onStatusChange when a new status is selected", async () => {
    const onStatusChange = jest.fn();

    render(
      <CommonTable
        {...defaultProps}
        filters={{
          statusOptions: [{ label: "Active", value: "Active" }],
          onStatusChange,
        }}
      />
    );

    fireEvent.mouseDown(screen.getByText("Status: All"));
    fireEvent.click(await screen.findByRole("option", { name: "Active" }));

    expect(onStatusChange).toHaveBeenCalledWith("Active");
  });

  test("updates rows per page in client mode when a new value is selected", async () => {
    render(<CommonTable {...defaultProps} />);

    fireEvent.mouseDown(
      screen.getByRole("combobox", { name: /rows per page/i })
    );

    fireEvent.click(await screen.findByRole("option", { name: "25" }));

    expect(
      screen.getByRole("combobox", { name: /rows per page/i })
    ).toHaveTextContent("25");
  });

  test("changes page internally in client mode when next page is clicked", () => {
    render(<CommonTable {...defaultProps} />);

    fireEvent.click(screen.getByLabelText("Go to next page"));

    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
  });

  test("calls onPageChange callback in server mode when page is changed", () => {
    const onPageChange = jest.fn();

    render(
      <CommonTable
        {...defaultProps}
        pagination={{
          mode: "server",
          page: 0,
          rowsPerPage: 15,
          totalCount: 50,
          onPageChange,
        }}
      />
    );

    fireEvent.click(screen.getByLabelText("Go to next page"));

    expect(onPageChange).toHaveBeenCalled();
  });

  test("calls onRowsPerPageChange callback in server mode when rows per page changes", async () => {
    const onRowsPerPageChange = jest.fn();

    render(
      <CommonTable
        {...defaultProps}
        pagination={{
          mode: "server",
          page: 0,
          rowsPerPage: 15,
          totalCount: 50,
          onRowsPerPageChange,
        }}
      />
    );

    fireEvent.mouseDown(screen.getByText("15"));
    fireEvent.click(await screen.findByRole("option", { name: "25" }));

    expect(onRowsPerPageChange).toHaveBeenCalledWith(25);
  });

  test("renders Actions column when action handlers are provided", () => {
    render(
      <CommonTable
        {...defaultProps}
        actions={{ onEdit: jest.fn() }}
      />
    );

    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("does not render Actions column when no action handlers are provided", () => {
    render(<CommonTable {...defaultProps} />);

    expect(screen.queryByText("Actions")).not.toBeInTheDocument();
  });
});
