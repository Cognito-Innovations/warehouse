import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as api from "../src/services/api.services";
import Category from "../src/pages/Category";

jest.mock("../src/services/api.services");

describe("Category Page", () => {
  const mockCategories = [
    {
      id: "1",
      name: "Electronics",
      slug: "electronics",
      discount_percentage: "2",
      products_count: 5,
      image_url: "img.jpg",
      description: "Test",
      is_active: true,
    },
    {
      id: "2",
      name: "Clothing",
      slug: "clothing",
      discount_percentage: "5",
      products_count: 10,
      image_url: "",
      description: "Test clothing",
      is_active: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);
    (api.deleteCategory as jest.Mock).mockResolvedValue({});
  });

  it("should fetch and display categories on mount", async () => {
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Electronics")).toBeInTheDocument();
      expect(screen.getByText("Clothing")).toBeInTheDocument();
    });

    expect(api.getCategories).toHaveBeenCalledTimes(1);
  });

  it("should open delete dialog and remove category", async () => {
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Electronics"));

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() =>
      expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument()
    );

    const confirmButton = screen.getByText("Delete");
    fireEvent.click(confirmButton);

    await waitFor(() =>
      expect(screen.queryByText("Electronics")).not.toBeInTheDocument()
    );

    expect(api.deleteCategory).toHaveBeenCalledWith("1");
  });
});