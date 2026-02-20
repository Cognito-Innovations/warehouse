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

  it("displays loader while fetching countries", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue(mockCountries);

    render(<CountriesPage />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await screen.findByText("India");
  });

  it("renders countries list after successful fetch", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue(mockCountries);

    render(<CountriesPage />);

    expect(await screen.findByText("India")).toBeInTheDocument();
  });

  it("renders empty list when API returns no countries", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue([]);

    render(<CountriesPage />);

    await waitFor(() =>
      expect(screen.queryByText("India")).not.toBeInTheDocument()
    );
  });

  it("shows error toast when fetching countries fails", async () => {
    (api.getCountries as jest.Mock).mockRejectedValue(new Error());

    render(<CountriesPage />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to fetch countries"
      )
    );
  });

  it("opens add country dialog when Add Country button is clicked", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue([]);

    render(<CountriesPage />);

    await screen.findByText("Add Country");
    await userEvent.click(screen.getByText("Add Country"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("adds a new country successfully and closes dialog", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue([]);
    (api.createCountry as jest.Mock).mockResolvedValue({
      id: 2,
      name: "USA",
      code: "US",
      phone_code: "+1",
      image: "",
    });

    render(<CountriesPage />);

    await userEvent.click(await screen.findByText("Add Country"));

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
      expect(toast.success).toHaveBeenCalledWith(
        'Country "USA" added successfully!'
      )
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("shows error toast and keeps dialog open if adding country fails", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue([]);
    (api.createCountry as jest.Mock).mockRejectedValue(new Error());

    render(<CountriesPage />);

    await userEvent.click(await screen.findByText("Add Country"));

    await userEvent.type(screen.getByLabelText(/country name/i), "USA");
    await userEvent.type(screen.getByLabelText(/iso code/i), "US");
    await userEvent.type(screen.getByLabelText(/phone code/i), "+1");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to add country"
      )
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens edit dialog with existing country data", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue(mockCountries);

    render(<CountriesPage />);

    await screen.findByText("India");

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(screen.getByDisplayValue("India")).toBeInTheDocument();
  });

  it("updates an existing country successfully and closes dialog", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue(mockCountries);
    (api.updateCountry as jest.Mock).mockResolvedValue({
      id: 1,
      name: "India Updated",
      code: "IN",
      phone_code: "+91",
      image: "",
    });

    render(<CountriesPage />);

    await screen.findByText("India");

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));

    await userEvent.clear(screen.getByLabelText(/country name/i));
    await userEvent.type(
      screen.getByLabelText(/country name/i),
      "India Updated"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /update/i })
    );

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        'Country "India Updated" updated successfully!'
      )
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("shows error toast and keeps dialog open when updating country fails", async () => {
    (api.getCountries as jest.Mock).mockResolvedValue(mockCountries);
    (api.updateCountry as jest.Mock).mockRejectedValue(new Error());
    
    render(<CountriesPage />);
    
    await screen.findByText("India");
    
    await userEvent.click(
      screen.getByRole("button", { name: /edit/i })
    );
    
    await userEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to update country"
      )
    );
  
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
