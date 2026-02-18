import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import * as api from "../src/services/api.services";
import CountriesPage from "../src/pages/CountriesPage";

jest.mock("../src/services/api.services");

jest.mock("sonner", () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CountriesPage", () => {
  const mockCountries = [
    { id: 1, name: "India", code: "IN", phone_code: "+91", image: "" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loader initially", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue(mockCountries);

    render(<CountriesPage />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await screen.findByText("India");
  });

  it("fetches and displays countries", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue(mockCountries);

    render(<CountriesPage />);

    expect(await screen.findByText("India")).toBeInTheDocument();
  });

  it("shows error toast if fetch fails", async () => {
    (api.getCountries as jest.Mock).mockRejectedValue(new Error());

    render(<CountriesPage />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to fetch countries"
      )
    );
  });

  it("adds country successfully", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue([]);
    (api.createCountry as jest.Mock).mockResolvedValue({
      id: 2,
      name: "USA",
      code: "US",
      phone_code: "+1",
      image: "",
    });

    render(<CountriesPage />);

    await screen.findByText("Add Country");

    await userEvent.click(screen.getByText("Add Country"));

    await userEvent.type(
      screen.getByLabelText(/country name/i),
      "USA"
    );

    await userEvent.type(
      screen.getByLabelText(/iso code/i),
      "US"
    );

    await userEvent.type(
      screen.getByLabelText(/phone code/i),
      "+1"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /save/i })
    );

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalled()
    );
  });

  it("shows error if create fails", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue([]);
    (api.createCountry as jest.Mock).mockRejectedValue(new Error());

    render(<CountriesPage />);

    await screen.findByText("Add Country");

    await userEvent.click(screen.getByText("Add Country"));

    await userEvent.type(
      screen.getByLabelText(/country name/i),
      "USA"
    );

    await userEvent.type(
      screen.getByLabelText(/iso code/i),
      "US"
    );

    await userEvent.type(
      screen.getByLabelText(/phone code/i),
      "+1"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /save/i })
    );

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to add country"
      )
    );
  });
});
