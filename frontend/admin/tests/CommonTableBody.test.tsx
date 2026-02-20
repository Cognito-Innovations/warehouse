import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import CommonTableBody from "../src/components/common/CommonTableBody";

const columns = [
  {
    header: "Name",
    cell: (row: any) => <span>{row.name}</span>,
  },
];

const rows = [{ id: "1", name: "Test", status: "Active" }];

const renderComponent = (props = {}) =>
  render(
    <table>
      <CommonTableBody
        rows={rows}
        columns={columns}
        getIdentifier={(r) => r.id}
        getRowStatus={(r) => r.status}
        {...props}
      />
    </table>
  );

describe("CommonTableBody Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all rows and column cells correctly", () => {
    renderComponent();
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("renders nothing when rows array is empty", () => {
    render(
      <table>
        <CommonTableBody
          rows={[]}
          columns={columns}
          getIdentifier={(r) => r.id}
          getRowStatus={(r) => r.status}
        />
      </table>
    );

    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  test("does not render actions column when hasActions is false", () => {
    renderComponent({ hasActions: false });

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("renders view details button when only onViewDetails is provided", async () => {
    const onViewDetails = jest.fn();

    renderComponent({
      hasActions: true,
      onViewDetails,
    });

    const viewButton = screen.getByLabelText("view-details");
    expect(viewButton).toBeInTheDocument();

    await userEvent.click(viewButton);
    expect(onViewDetails).toHaveBeenCalledWith("1");
  });

  test("renders edit button and calls onEdit when clicked", async () => {
    const onEdit = jest.fn();

    renderComponent({
      hasActions: true,
      onEdit,
    });

    const editButton = screen.getAllByRole("button")[0];
    await userEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith("1");
  });

  test("renders delete button and calls onDelete when clicked", async () => {
    const onDelete = jest.fn();

    renderComponent({
      hasActions: true,
      onDelete,
    });

    const deleteButton = screen.getByLabelText("delete");
    expect(deleteButton).toBeInTheDocument();

    await userEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  test("renders toggle switch and calls onToggle with correct value when toggled", async () => {
    const onToggle = jest.fn().mockResolvedValue(undefined);

    renderComponent({
      hasActions: true,
      onEdit: jest.fn(),
      onToggle,
    });

    const toggle = screen.getByRole("switch");
    expect(toggle).toBeChecked();

    await userEvent.click(toggle);

    expect(onToggle).toHaveBeenCalledWith("1", false);
  });

  test("shows loading spinner instead of toggle when isToggleLoading returns true", () => {
    renderComponent({
      hasActions: true,
      onEdit: jest.fn(),
      onToggle: jest.fn(),
      isToggleLoading: () => true,
    });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });

  test("renders toggle as unchecked when row status is not Active", () => {
    const inactiveRows = [{ id: "1", name: "Test", status: "Inactive" }];

    render(
      <table>
        <CommonTableBody
          rows={inactiveRows}
          columns={columns}
          getIdentifier={(r) => r.id}
          getRowStatus={(r) => r.status}
          hasActions
          onEdit={jest.fn()}
          onToggle={jest.fn()}
        />
      </table>
    );

    const toggle = screen.getByRole("switch");
    expect(toggle).not.toBeChecked();
  });
});
