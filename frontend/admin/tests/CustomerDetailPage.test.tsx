import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

import * as api from "../src/services/api.services";
import CustomerDetailPage from "../src/pages/CustomerDetailPage";

jest.mock("../src/services/api.services");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "A101" }),
}));

const mockUser = {
  id: "123",
  name: "Test User",
  suite_no: "A101",
  email: "test@example.com",
  phone_number: "1234567890",
  dob: "1990-01-01",
  gender: "male",
  verified: true,
  is_active: true,
  identifier: "google",
};

describe("CustomerDetailPage - Functional Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <CustomerDetailPage />
      </MemoryRouter>
    );

  test("shows loading spinner initially", async () => {
    (api.getUserBySuiteNo as jest.Mock).mockResolvedValueOnce(mockUser);

    renderPage();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() =>
      expect(api.getUserBySuiteNo).toHaveBeenCalledWith("A101")
    );
  });

  test("renders user details on successful fetch", async () => {
    (api.getUserBySuiteNo as jest.Mock).mockResolvedValueOnce(mockUser);

    renderPage();

    expect(await screen.findByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Suite: A101")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("google")).toBeInTheDocument();
  });

  test("shows error message if API fails", async () => {
    (api.getUserBySuiteNo as jest.Mock).mockRejectedValueOnce(
      new Error("API Error")
    );

    renderPage();

    expect(
      await screen.findByText("Failed to fetch user details.")
    ).toBeInTheDocument();
  });

  test("shows 'Customer not found' if API returns null", async () => {
    (api.getUserBySuiteNo as jest.Mock).mockResolvedValueOnce(null);

    renderPage();

    expect(
      await screen.findByText("Customer not found.")
    ).toBeInTheDocument();
  });
});
