import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

import * as api from "../src/services/api.services";
import PreArrivals from "../src/pages/PreArrivals";

jest.mock("../src/services/api.services");

const mockPreArrivals = [
  {
    id: 1,
    otp: "123456",
    tracking_no: "TRK1",
    user: "Test User",
    suite: "A1",
    estimate_arrival_time: "Tomorrow",
    created_at: "2024-01-01T10:00:00Z",
    status: "PENDING",
  },
  {
    id: 2,
    otp: "654321",
    tracking_no: "TRK2",
    user: "Test User 1",
    suite: "B2",
    estimate_arrival_time: "Today",
    created_at: "2024-01-02T10:00:00Z",
    status: "RECEIVED",
  },
];

describe("PreArrivals Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <PreArrivals />
      </MemoryRouter>
    );

  test("shows loading state initially", async () => {
    (api.getPreArrivals as jest.Mock).mockResolvedValueOnce([]);

    renderPage();

    expect(screen.getByText(/Loading pre-arrivals/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(api.getPreArrivals).toHaveBeenCalledTimes(1)
    );
  });

  test("renders fetched data correctly", async () => {
    (api.getPreArrivals as jest.Mock).mockResolvedValueOnce(mockPreArrivals);

    renderPage();

    expect(await screen.findByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Test User 1")).toBeInTheDocument();
  });

  test("renders error state when API fails", async () => {
    (api.getPreArrivals as jest.Mock).mockRejectedValueOnce(
      new Error("API Error")
    );

    renderPage();

    expect(await screen.findByText(/Error: API Error/i)).toBeInTheDocument();
  });

  test("filters data by status", async () => {
    (api.getPreArrivals as jest.Mock).mockResolvedValueOnce(mockPreArrivals);

    renderPage();

    await screen.findByText("Test User");

    fireEvent.mouseDown(screen.getByRole("combobox"));

    const listbox = await screen.findByRole("listbox");

    const receivedOption = within(listbox).getByRole("option", {
      name: "Received",
    });

    fireEvent.click(receivedOption);

    await waitFor(() => {
      expect(screen.queryByText("Test User")).not.toBeInTheDocument();
      expect(screen.getByText("Test User 1")).toBeInTheDocument();
    });
  });

  test("marks item as received and updates UI", async () => {
    (api.getPreArrivals as jest.Mock).mockResolvedValueOnce(mockPreArrivals);

    (api.markPreArrivalAsReceived as jest.Mock).mockResolvedValueOnce({
      ...mockPreArrivals[0],
      status: "RECEIVED",
    });

    renderPage();

    await screen.findByText("Test User");

    const row = screen.getByText("Test User").closest("tr")!;
    const buttons = within(row).getAllByRole("button");

    fireEvent.click(buttons[1]);

    const markOption = await screen.findByText(/mark/i);
    fireEvent.click(markOption);

    await waitFor(() => {
      expect(api.markPreArrivalAsReceived).toHaveBeenCalledWith(1);
    });
  });

  test("shows empty state when no data", async () => {
    (api.getPreArrivals as jest.Mock).mockResolvedValueOnce([]);

    renderPage();

    expect(
      await screen.findByText(/No pre-arrivals found/i)
    ).toBeInTheDocument();
  });
});
