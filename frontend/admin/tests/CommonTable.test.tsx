import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import CommonTable from "../src/components/common/CommonTable";

const columns = [
  {
    header: "Name",
    cell: (row: any) => <span>{row.name}</span>,
    width: "50%",
  },
];

const rows = [{ id: "1", name: "Test", status: "Active" }];

describe("CommonTable Component", () => {
  test("renders table with data", () => {
    render(
      <CommonTable
        rows={rows}
        columns={columns}
        loading={false}
        noDataMessage="No data"
        getIdentifier={(r) => r.id}
        getRowStatus={(r) => r.status}
      />
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    render(
      <CommonTable
        rows={[]}
        columns={columns}
        loading={true}
        noDataMessage="No data"
        getIdentifier={(r) => r.id}
        getRowStatus={(r) => r.status}
      />
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("shows no data message", () => {
    render(
      <CommonTable
        rows={[]}
        columns={columns}
        loading={false}
        noDataMessage="No data"
        getIdentifier={(r) => r.id}
        getRowStatus={(r) => r.status}
      />
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });
});
