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

describe("CommonTableBody Component", () => {
  test("renders rows correctly", () => {
    render(
      <table>
        <CommonTableBody
          rows={rows}
          columns={columns}
          getIdentifier={(r) => r.id}
          getRowStatus={(r) => r.status}
        />
      </table>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("calls onViewDetails when clicked", async () => {
    const onViewDetails = jest.fn();

    render(
      <table>
        <CommonTableBody
          rows={rows}
          columns={columns}
          getIdentifier={(r) => r.id}
          getRowStatus={(r) => r.status}
          onViewDetails={onViewDetails}
          hasActions
        />
      </table>
    );

    await userEvent.click(screen.getByRole("button"));
    expect(onViewDetails).toHaveBeenCalledWith("1");
  });

  test("calls onDelete when delete clicked", async () => {
    const onDelete = jest.fn();

    render(
      <table>
        <CommonTableBody
          rows={rows}
          columns={columns}
          getIdentifier={(r) => r.id}
          getRowStatus={(r) => r.status}
          onDelete={onDelete}
          hasActions
        />
      </table>
    );

    await userEvent.click(screen.getByLabelText("delete"));
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
