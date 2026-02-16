import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as api from "../src/services/api.services";
import * as auth from "../src/hooks/useAuth";
import Products from "../src/pages/Products";

jest.mock("../src/services/api.services");
jest.mock("../src/hooks/useAuth");

describe("Products Page", () => {
  const mockProducts = [
    {
      id: "1",
      name: "iPhone 15",
      slug: "iphone-15",
      description: "Apple phone",
      image_url: "iphone.jpg",
      stock_quantity: 50,
      is_active: true,
      discount_percentage: "0",
      unit_value: "1",
      price: {
        price: 999,
        currency: "$",
      },
      category: {
        id: "101",
        name: "Electronics",
      },
      sub_category: {
        id: "201",
        name: "Smartphones",
      },
      measurement: {
        id: "m1",
        label: "Piece",
      },
      cargo_option: {
        id: "c1",
        label: "Express",
      },
    },
    {
      id: "2",
      name: "Cotton T-Shirt",
      slug: "cotton-t-shirt",
      description: "100% Cotton",
      image_url: "",
      stock_quantity: 100,
      is_active: false,
      discount_percentage: "2",
      unit_value: "1",
      price: {
        price: 20,
        currency: "$",
      },
      category: {
        id: "102",
        name: "Clothing",
      },
      sub_category: {
        id: "202",
        name: "T-Shirts",
      },
      measurement: {
        id: "m1",
        label: "Piece",
      },
      cargo_option: {
        id: "c2",
        label: "Standard",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (api.getProducts as jest.Mock).mockResolvedValue(mockProducts);
    (api.deleteProduct as jest.Mock).mockResolvedValue({});
    (api.updateEcommerceProduct as jest.Mock).mockResolvedValue({});

    (auth.useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, name: "Admin" },
      isAuthenticated: true,
      logout: jest.fn(),
    });
  });

  it("should fetch and display products on mount", async () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("iPhone 15")).toBeInTheDocument();
      expect(screen.getByText("Cotton T-Shirt")).toBeInTheDocument();
    });

    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Smartphones")).toBeInTheDocument();
    expect(screen.getByText("Express")).toBeInTheDocument();
    expect(screen.getByText("$ 999.00")).toBeInTheDocument();

    expect(api.getProducts).toHaveBeenCalledWith("");
  });

  it("should handle search input", async () => {
    render(
        <MemoryRouter>
          <Products />
        </MemoryRouter>
    );
    
    await waitFor(() => screen.getByText("iPhone 15"));

    const searchInput = screen.getByPlaceholderText(/search product by product name/i);

    fireEvent.change(searchInput, { target: { value: "iPhone" } });

    await waitFor(() => {
        expect(api.getProducts).toHaveBeenCalledWith("iPhone");
    }, { timeout: 1000 });
  });

  it("should open delete dialog and remove product", async () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("iPhone 15"));

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to delete this product/i)
      ).toBeInTheDocument()
    );

    const confirmButton = screen.getByText("Delete");
    fireEvent.click(confirmButton);

    await waitFor(() =>
      expect(screen.queryByText("iPhone 15")).not.toBeInTheDocument()
    );

    expect(api.deleteProduct).toHaveBeenCalledWith("1");
  });
});