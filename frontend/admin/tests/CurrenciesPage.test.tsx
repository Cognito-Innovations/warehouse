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

  it("shows loader while fetching currencies", async () => {
    (api.getCurrencies as jest.Mock).mockResolvedValue([]);

    render(<CurrenciesPage />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );
  });

  it("displays fetched currencies in the table", async () => {
    (api.getCurrencies as jest.Mock).mockResolvedValue([
      { id: 1, code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
    ]);

    render(<CurrenciesPage />);

    const table = await screen.findByRole("table");

    expect(within(table).getByText("US Dollar")).toBeInTheDocument();
    expect(within(table).getByText("1")).toBeInTheDocument();
  });

  it("shows error toast if fetching currencies fails", async () => {
    (api.getCurrencies as jest.Mock).mockRejectedValue(new Error());

    render(<CurrenciesPage />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch currencies")
    );
  });

  it("adds a new currency successfully and updates the table", async () => {
    (api.getCurrencies as jest.Mock).mockResolvedValue([]);

    (api.createCurrency as jest.Mock).mockResolvedValue({
      id: 1,
      code: "USD",
      symbol: "$",
      name: "US Dollar",
      rate: 1,
    });

    render(<CurrenciesPage />);
  
    await userEvent.click(await screen.findByText("Add Currency"));
  
    const dialog = screen.getByRole("dialog");

    await userEvent.type(
      within(dialog).getByLabelText(/currency name/i),
      "US Dollar"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/currency code/i),
      "USD"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/currency symbol/i),
      "$"
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

    expect(await screen.findByText("US Dollar")).toBeInTheDocument();
  });

  it("shows error toast if adding currency fails", async () => {
    (api.getCurrencies as jest.Mock).mockResolvedValue([]);
    (api.createCurrency as jest.Mock).mockRejectedValue(new Error());
  
    render(<CurrenciesPage />);
  
    await userEvent.click(await screen.findByText("Add Currency"));
  
    const dialog = screen.getByRole("dialog");

    await userEvent.type(
      within(dialog).getByLabelText(/currency name/i),
      "US Dollar"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/currency code/i),
      "USD"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/currency symbol/i),
      "$"
    );
  
    await userEvent.type(
      within(dialog).getByLabelText(/rate/i),
      "1"
    );
  
    await userEvent.click(
      within(dialog).getByRole("button", { name: /save/i })
    );

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to add currency")
    );
  });

  it("updates an existing currency successfully", async () => {
    (api.getCurrencies as jest.Mock).mockResolvedValue([
      {
        id: 1,
        currency_code: "USD",
        currency_symbol: "$",
        name: "US Dollar",
        rate: 1,
      },
    ]);

    (api.updateCurrency as jest.Mock).mockResolvedValue({
      id: 1,
      currency_code: "USD",
      currency_symbol: "$",
      name: "US Dollar Updated",
      rate: 1.2,
    });

    render(<CurrenciesPage />);

    const table = await screen.findByRole("table");

    await userEvent.click(
      within(table).getByRole("button", { name: /edit currency/i })
    );

    const dialog = await screen.findByRole("dialog");

    const nameInput = within(dialog).getByLabelText(/currency name/i);

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "US Dollar Updated");

    await userEvent.click(
      within(dialog).getByRole("button", { name: /update/i })
    );

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Currency updated successfully!"
      )
    );

    expect(
      await screen.findByText("US Dollar Updated")
    ).toBeInTheDocument();
  });

  it("shows error toast if updating currency fails", async () => {
    (api.getCurrencies as jest.Mock).mockResolvedValue([
      {
        id: 1,
        currency_code: "USD",
        currency_symbol: "$",
        name: "US Dollar",
        rate: 1,
      },
    ]);

    (api.updateCurrency as jest.Mock).mockRejectedValue(new Error());

    render(<CurrenciesPage />);

    const table = await screen.findByRole("table");

    await userEvent.click(
      within(table).getByRole("button", { name: /edit currency/i })
    );

    const dialog = await screen.findByRole("dialog");

    await userEvent.click(
      within(dialog).getByRole("button", { name: /update/i })
    );
  
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to update currency"
      )
    );
  });
});
