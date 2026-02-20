import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as api from "../src/services/api.services";
import Customers from "../src/pages/Customers";

jest.mock("../src/services/api.services");

describe("Customers Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

  const mockUsers = [
    {
      id: "1",
      name: "Test User",
      suite_no: "A-101",
      email: "test@test.com",
      role: "user",
      email_verified: true,
      phone_number: "1234567890",
      identifier: "ID001",
      verified: true,
      gender: "male",
      dob: "1990-01-01",
    },
  ];

  it("renders loading state initially", async () => {
    (api.getUsers as jest.Mock).mockResolvedValue([]);

    renderPage();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );
  });

  it("fetches and displays customers", async () => {
    (api.getUsers as jest.Mock).mockResolvedValue(mockUsers);

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("Test User")).toBeInTheDocument()
    );

    expect(screen.getByText("test@test.com")).toBeInTheDocument();
  });

  it("shows fallback for missing phone number", async () => {
    const userWithoutPhone = [{ ...mockUsers[0], phone_number: null }];
    (api.getUsers as jest.Mock).mockResolvedValue(userWithoutPhone);

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("—")).toBeInTheDocument()
    );
  });

  it("shows error message if fetch fails", async () => {
    (api.getUsers as jest.Mock).mockRejectedValue(new Error());

    renderPage();

    await waitFor(() =>
      expect(
        screen.getByText(
          "Failed to load customer data. Please try again later."
        )
      ).toBeInTheDocument()
    );
  });
});
