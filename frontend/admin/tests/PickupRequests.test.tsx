import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import * as api from "../src/services/api.services";
import PickupRequests from "../src/pages/PickupRequests";

jest.mock("../src/services/api.services");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockRequests = [
  {
    id: "1",
    created_at: "2024-01-01T10:00:00Z",
    user: { name: "Test User" },
    pickup_address: "New York",
    supplier_name: "Amazon",
    status: "REQUESTED",
  },
  {
    id: "2",
    created_at: "2024-01-02T10:00:00Z",
    user: { name: "Test User 1" },
    pickup_address: "California",
    supplier_name: "Flipkart",
    status: "PICKED",
  },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <PickupRequests />
    </MemoryRouter>
  );

describe("PickupRequests Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading initially", async () => {
    (api.getPickupRequests as jest.Mock).mockResolvedValue(mockRequests);

    renderPage();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders pickup requests successfully", async () => {
    (api.getPickupRequests as jest.Mock).mockResolvedValue(mockRequests);

    renderPage();

    await screen.findByText("Test User");
    expect(screen.getByText("Test User 1")).toBeInTheDocument();
    expect(screen.getByText("Amazon")).toBeInTheDocument();
  });

  test("shows empty state when no requests", async () => {
    (api.getPickupRequests as jest.Mock).mockResolvedValue([]);

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText("No pickup requests available")
      ).toBeInTheDocument();
    });
  });

  test("navigates to details page on view click", async () => {
    (api.getPickupRequests as jest.Mock).mockResolvedValue(mockRequests);

    renderPage();

    await screen.findByText("Test User");

    const viewButton = screen.getAllByLabelText("view-details")[0];
    await userEvent.click(viewButton);

    expect(mockNavigate).toHaveBeenCalledWith("/pickups/1");
  });

  test("handles API failure gracefully", async () => {
    (api.getPickupRequests as jest.Mock).mockRejectedValue(
      new Error("API Failed")
    );

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText("No pickup requests available")
      ).toBeInTheDocument();
    });
  });
});
