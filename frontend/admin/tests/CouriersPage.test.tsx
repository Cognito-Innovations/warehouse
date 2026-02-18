import { render, screen, waitFor } from "@testing-library/react";
import CouriersPage from "../src/pages/CouriersPage";

import * as api from "../src/services/api.services";
import { toast } from "sonner";

jest.mock("../src/services/api.services");

jest.mock("sonner", () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CouriersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads couriers and countries successfully", async () => {
    (api.getCouriers as jest.Mock).mockResolvedValue([
      { id: 1, name: "DHL", country_id: 1 },
    ]);
    (api.getCountries as jest.Mock).mockResolvedValue([
      { id: 1, name: "India" },
    ]);

    render(<CouriersPage />);

    await waitFor(() =>
      expect(screen.getByText("DHL")).toBeInTheDocument()
    );
  });

  it("shows error if couriers fail", async () => {
    (api.getCouriers as jest.Mock).mockRejectedValue(new Error());
    (api.getCountries as jest.Mock).mockResolvedValue([]);

    render(<CouriersPage />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch couriers")
    );
  });

  it("shows error if countries fail", async () => {
    (api.getCouriers as jest.Mock).mockResolvedValue([]);
    (api.getCountries as jest.Mock).mockRejectedValue(new Error());

    render(<CouriersPage />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch countries")
    );
  });
});
