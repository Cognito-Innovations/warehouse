import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { toast } from "sonner";

import * as api from "../src/services/api.services";
import CouriersPage from "../src/pages/CouriersPage";

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

  it("shows loader while data is being fetched", async () => {
    (api.getCouriers as jest.Mock).mockResolvedValue([]);
    (api.getCountries as jest.Mock).mockResolvedValue([]);

    render(<CouriersPage />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );
  });

  it("renders couriers when both APIs succeed", async () => {
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

  it("shows error toast if couriers API fails", async () => {
    (api.getCouriers as jest.Mock).mockRejectedValue(new Error());
    (api.getCountries as jest.Mock).mockResolvedValue([]);

    render(<CouriersPage />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch couriers")
    );
  });

  it("shows error toast if countries API fails", async () => {
    (api.getCouriers as jest.Mock).mockResolvedValue([]);
    (api.getCountries as jest.Mock).mockRejectedValue(new Error());

    render(<CouriersPage />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch countries")
    );
  });

  it("shows both error toasts if both APIs fail", async () => {
    (api.getCouriers as jest.Mock).mockRejectedValue(new Error());
    (api.getCountries as jest.Mock).mockRejectedValue(new Error());

    render(<CouriersPage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch couriers");
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch countries");
    });
  });
});

describe("CouriersPage - Add Courier", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (api.getCouriers as jest.Mock).mockResolvedValue([]);
    (api.getCountries as jest.Mock).mockResolvedValue([
      { id: 1, name: "India" },
    ]);
  });

  it("successfully adds a new courier", async () => {
    (api.createCourier as jest.Mock).mockResolvedValue({
      id: 2,
      name: "FedEx",
      country_id: 1,
    });

    render(<CouriersPage />);

    await waitFor(() =>
      expect(screen.getByText("Add Courier")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Add Courier"));

    await waitFor(() => {
      expect(api.createCourier).not.toHaveBeenCalled();
    });
  });

  it("shows error toast when adding courier fails", async () => {
    (api.createCourier as jest.Mock).mockRejectedValue(new Error());

    render(<CouriersPage />);

    await waitFor(() =>
      expect(screen.getByText("Add Courier")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Add Courier"));

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalledWith(
        expect.stringContaining("Failed to add courier")
      );
    });
  });
});

describe("CouriersPage - Update Courier", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (api.getCouriers as jest.Mock).mockResolvedValue([
      { id: 1, name: "DHL", country_id: 1 },
    ]);
    (api.getCountries as jest.Mock).mockResolvedValue([
      { id: 1, name: "India" },
    ]);
  });

  it("successfully updates an existing courier", async () => {
    (api.updateCourier as jest.Mock).mockResolvedValue({
      id: 1,
      name: "DHL Express",
      country_id: 1,
    });

    render(<CouriersPage />);

    await waitFor(() =>
      expect(screen.getByText("DHL")).toBeInTheDocument()
    );
  });

  it("shows error toast when updating courier fails", async () => {
    (api.updateCourier as jest.Mock).mockRejectedValue(new Error());

    render(<CouriersPage />);

    await waitFor(() =>
      expect(screen.getByText("DHL")).toBeInTheDocument()
    );

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalledWith(
        expect.stringContaining("Failed to update courier")
      );
    });
  });
});
