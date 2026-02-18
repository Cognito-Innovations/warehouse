import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as api from "../src/services/api.services";
import Orders from "../src/pages/Orders";

jest.mock("../src/services/api.services");

describe("Orders Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

  const mockOrders = [
    {
      id: "1",
      order_number: "ORD-001",
      user_name: "Test User",
      items_count: "2",
      total_amount: "150",
      payment_mode: "Card",
      created_at: "2024-01-01T10:00:00Z",
      status: "Oredered",
    },
  ];

  it("renders loading state", async () => {
    (api.getOrders as jest.Mock).mockResolvedValue([]);

    renderPage();

    await waitFor(() =>
      expect(api.getOrders).toHaveBeenCalled()
    );
  });

  it("fetches and displays orders", async () => {
    (api.getOrders as jest.Mock).mockResolvedValue(mockOrders);

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("ORD-001")).toBeInTheDocument()
    );

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Card")).toBeInTheDocument();
    expect(screen.getByText("Oredered")).toBeInTheDocument();
  });

  it("handles invalid numeric values safely", async () => {
    const invalidOrder = [
      { ...mockOrders[0], items_count: "abc", total_amount: "xyz" },
    ];

    (api.getOrders as jest.Mock).mockResolvedValue(invalidOrder);

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("0")).toBeInTheDocument()
    );
  });

  it("shows no data message when empty", async () => {
    (api.getOrders as jest.Mock).mockResolvedValue([]);

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("No orders available")).toBeInTheDocument()
    );
  });

  it("does not crash on fetch error", async () => {
    (api.getOrders as jest.Mock).mockRejectedValue(new Error());

    renderPage();

    await waitFor(() =>
      expect(api.getOrders).toHaveBeenCalled()
    );
  });
});
