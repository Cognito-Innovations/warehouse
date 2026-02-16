import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as api from "../src/services/api.services";
import * as auth from "../src/hooks/useAuth";
import SubCategory from "../src/pages/SubCategory";

jest.mock("../src/services/api.services");
jest.mock("../src/hooks/useAuth");

describe("SubCategory Page", () => {
  const mockSubCategories = [
    {
      id: "1",
      name: "Smartphones",
      slug: "smartphones",
      discount_percentage: "3",
      products_count: 12,
      is_active: true,
      category: {
        id: "101",
        name: "Electronics",
      },
    },
    {
      id: "2",
      name: "Men's T-Shirts",
      slug: "mens-t-shirts",
      discount_percentage: "2",
      products_count: 50,
      is_active: false,
      category: {
        id: "102",
        name: "Clothing",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (api.getSubCategories as jest.Mock).mockResolvedValue(mockSubCategories);
    (api.deleteSubCategory as jest.Mock).mockResolvedValue({});

    (auth.useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        name: "Test Admin",
        email: "admin@example.com",
        avatar: "avatar.jpg",
      },
      isAuthenticated: true,
      logout: jest.fn(),
    });
  });

  it("should fetch and display sub categories on mount", async () => {
    render(
      <MemoryRouter>
        <SubCategory />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Smartphones")).toBeInTheDocument();
      expect(screen.getByText("Men's T-Shirts")).toBeInTheDocument();
    });

    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();

    expect(api.getSubCategories).toHaveBeenCalledTimes(1);
  });

  it("should open delete dialog and remove sub category", async () => {
    render(
      <MemoryRouter>
        <SubCategory />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Smartphones"));

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to delete this sub category/i)
      ).toBeInTheDocument()
    );

    const confirmButton = screen.getByText("Delete");
    fireEvent.click(confirmButton);

    await waitFor(() =>
      expect(screen.queryByText("Smartphones")).not.toBeInTheDocument()
    );

    expect(api.deleteSubCategory).toHaveBeenCalledWith("1");
  });
});