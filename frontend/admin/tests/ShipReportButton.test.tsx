import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { toast } from "sonner";

import ShipReportButton from "../src/components/Shipments/ShipReportButton";
import * as reportUtils from "../src/utils/shipmentReport.utils";

jest.mock("../src/utils/shipmentReport.utils");
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("ShipReportButton", () => {
  test("shows error if no shipments", async () => {
    render(<ShipReportButton shipments={[]} loading={false} />);

    await userEvent.click(screen.getByText(/Ship Requested Report/i));

    expect(toast.error).toHaveBeenCalled();
  });

  test("generates report when shipments exist", async () => {
    const shipments = [{ id: "1" }];
    (reportUtils.buildShipmentReportRows as jest.Mock).mockReturnValue([]);
    (reportUtils.downloadExcelReport as jest.Mock).mockImplementation();

    render(<ShipReportButton shipments={shipments} loading={false} />);

    await userEvent.click(screen.getByText(/Ship Requested Report/i));

    expect(reportUtils.buildShipmentReportRows).toHaveBeenCalled();
    expect(reportUtils.downloadExcelReport).toHaveBeenCalled();
  });

  test("disables button while loading", () => {
    render(<ShipReportButton shipments={[]} loading={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
