import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { toast } from "sonner";

import Packages from "../src/pages/Packages";
import * as api from "../src/services/api.services";

jest.mock("../src/services/api.services");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockPackages = [
  {
    id: "1",
    package_id: "PKG001",
    tracking_no: "TRK001",
    created_at: "2024-01-01T10:00:00Z",
    status: { value: "Pending" },
    user: { name: "John", suite_no: "A1" },
    vendor: { supplier_name: "Amazon" },
    rack_slot: { label: "R1" },
  },
  {
    id: "2",
    package_id: "PKG002",
    tracking_no: "TRK002",
    created_at: "2024-01-02T10:00:00Z",
    status: { value: "Shipped" },
    user: { name: "Jane", suite_no: "B1" },
    vendor: { supplier_name: "Flipkart" },
    rack_slot: { label: "R2" },
  },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <Packages />
    </MemoryRouter>
  );

describe("Packages Page - Component & Functional Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads and displays packages successfully", async () => {
    (api.getPackage as jest.Mock).mockResolvedValue(mockPackages);

    renderPage();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("PKG001")).toBeInTheDocument();
      expect(screen.getByText("PKG002")).toBeInTheDocument();
    });

    expect(api.getPackage).toHaveBeenCalled();
  });

  test("shows error when package fetch fails", async () => {
    (api.getPackage as jest.Mock).mockRejectedValue(
      new Error("Network Error")
    );

    renderPage();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    expect(screen.getByText("No packages found")).toBeInTheDocument();
  });

  test("search filters packages correctly", async () => {
    (api.searchPackages as jest.Mock).mockResolvedValue([mockPackages[0]]);
    (api.getPackage as jest.Mock).mockResolvedValue(mockPackages);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("PKG001")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, "PKG001");

    await waitFor(() => {
      expect(api.searchPackages).toHaveBeenCalled();
    });
  });

  test("navigates to package details page", async () => {
    (api.getPackage as jest.Mock).mockResolvedValue(mockPackages);
  
    renderPage();
  
    await screen.findByText("PKG001");
  
    const pkgRow = screen.getByText("PKG001").closest("tr")!;
    const viewButton = within(pkgRow).getByRole("button");
  
    await userEvent.click(viewButton);
  
    expect(mockNavigate).toHaveBeenCalledWith("/packages/PKG001");
  });

  test("shows loading state in status cards", async () => {
    (api.getPackage as jest.Mock).mockResolvedValue(mockPackages);
  
    renderPage();
  
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  
    await screen.findByText("Pending");
  });

  test("renders empty state when no packages exist", async () => {
    (api.getPackage as jest.Mock).mockResolvedValue([]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("No packages found")).toBeInTheDocument();
    });
  });

  test("opens register package modal when button clicked", async () => {
    (api.getPackage as jest.Mock).mockResolvedValue(mockPackages);
  
    renderPage();
  
    const openButton = await screen.findByRole("button", {
      name: /register package/i,
    });
  
    await userEvent.click(openButton);
  
    expect(
      await screen.findByRole("dialog")
    ).toBeInTheDocument();
  });
});
