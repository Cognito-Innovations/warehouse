import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import * as api from "../src/services/api.services";
import CurrenciesPage from "../src/pages/CurrenciesPage";

jest.mock("../src/services/api.services");

jest.mock("sonner", () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CurrenciesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and displays currencies", async () => {
    (api.getCurrencies as jest.Mock).mockResolvedValue([
      { id: 1, name: "USD", symbol: "$" },
    ]);

    render(<CurrenciesPage />);

    await waitFor(() =>
      expect(screen.getByText("USD")).toBeInTheDocument()
    );
  });

  it("shows error on fetch failure", async () => {
    (api.getCurrencies as jest.Mock).mockRejectedValue(new Error());

    render(<CurrenciesPage />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch currencies")
    );
  });

  it("adds currency successfully", async () => {
    (api.getCurrencies as jest.Mock).mockResolvedValue([]);
    (api.createCurrency as jest.Mock).mockResolvedValue({});
  
    render(<CurrenciesPage />);
  
    await userEvent.click(await screen.findByText("Add Currency"));
  
    const dialog = screen.getByRole("dialog");
  
    await userEvent.type(
      within(dialog).getByLabelText(/currency code/i),
      "USD"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/currency symbol/i),
      "$"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/name/i),
      "US Dollar"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/rate/i),
      "1"
    );
  
    await userEvent.click(
      within(dialog).getByRole("button", { name: /save/i })
    );
  
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Currency added successfully!"
      )
    );
  });

  it("shows error if save fails", async () => {
    (api.getCurrencies as jest.Mock).mockResolvedValue([]);
    (api.createCurrency as jest.Mock).mockRejectedValue(new Error());
  
    render(<CurrenciesPage />);
  
    await userEvent.click(await screen.findByText("Add Currency"));
  
    const dialog = screen.getByRole("dialog");
  
    await userEvent.type(
      within(dialog).getByLabelText(/currency code/i),
      "USD"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/currency symbol/i),
      "$"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/name/i),
      "US Dollar"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/rate/i),
      "1"
    );
  
    await userEvent.click(
      within(dialog).getByRole("button", { name: /save/i })
    );
  
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to add currency"
      )
    );
  });
});
