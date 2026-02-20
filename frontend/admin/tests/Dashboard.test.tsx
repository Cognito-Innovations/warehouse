import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as api from "../src/services/api.services";
import Dashboard from "../src/pages/Dashboard";

jest.mock("../src/services/api.services");

jest.mock("../src/components/Layout/TopNavbar", () => (props: any) => (
  <div>
    <input
      data-testid="search-input"
      value={props.searchValue}
      onChange={(e) => props.onSearchChange(e.target.value)}
    />
  </div>
));

jest.mock("../src/components/Dashboard/MetricCard", () => ({
  __esModule: true,
  default: ({ title, value }: any) => (
    <div data-testid="metric-card">
      {title} - {value}
    </div>
  ),
}));

jest.mock("../src/components/Dashboard/DashboardCharts", () => () => (
  <div>DashboardCharts</div>
));

describe("Dashboard Page", () => {
  const mockMetricsResponse = {
    customers: 10,
    activePackages: 5,
    actionRequiredPackages: 2,
    shipRequestShipments: 3,
    paymentPendingShipments: 4,
    paymentApprovalShipments: 6,
    readyToShipShipments: 7,
    shippedShipments: 8,
    pickupRequested: 1,
    shoppingRequested: 9,
    quotationConfirm: 11,
    assistPaymentApproval: 12,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

  it("should show loading initially", () => {
    (api.getDashboardMetrics as jest.Mock).mockResolvedValue(
      mockMetricsResponse
    );

    renderPage();

    expect(screen.getByText(/Loading Dashboard/i)).toBeInTheDocument();
  });

  it("should fetch and display mapped metrics correctly", async () => {
    (api.getDashboardMetrics as jest.Mock).mockResolvedValue(
      mockMetricsResponse
    );

    renderPage();

    await waitFor(() =>
      expect(api.getDashboardMetrics).toHaveBeenCalledTimes(1)
    );

    await waitFor(() =>
      expect(
        screen.queryByText(/Loading Dashboard/i)
      ).not.toBeInTheDocument()
    );

    expect(screen.getByText("DashboardCharts")).toBeInTheDocument();

    const metricCards = screen.getAllByTestId("metric-card");
    expect(metricCards.length).toBe(12);

    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it("should convert numeric values to string before displaying", async () => {
    (api.getDashboardMetrics as jest.Mock).mockResolvedValue(
      mockMetricsResponse
    );

    renderPage();

    await waitFor(() =>
      expect(screen.queryByText(/Loading Dashboard/i)).not.toBeInTheDocument()
    );

    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it("should stop loading if API fails", async () => {
    (api.getDashboardMetrics as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    renderPage();

    await waitFor(() =>
      expect(api.getDashboardMetrics).toHaveBeenCalledTimes(1)
    );

    await waitFor(() =>
      expect(
        screen.queryByText(/Loading Dashboard/i)
      ).not.toBeInTheDocument()
    );
  });

  it("should update search value when user types", async () => {
    (api.getDashboardMetrics as jest.Mock).mockResolvedValue(
      mockMetricsResponse
    );

    renderPage();

    const input = screen.getByTestId("search-input");

    fireEvent.change(input, {
      target: { value: "warehouse" },
    });

    expect(input).toHaveValue("warehouse");
  });

  it("should handle partial API response correctly", async () => {
    (api.getDashboardMetrics as jest.Mock).mockResolvedValue({
      customers: 100,
    });

    renderPage();

    await waitFor(() =>
      expect(
        screen.queryByText(/Loading Dashboard/i)
      ).not.toBeInTheDocument()
    );

    expect(screen.getByText("DashboardCharts")).toBeInTheDocument();
  });
});
