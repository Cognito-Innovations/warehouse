import { render, screen, waitFor, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
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
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

  it("loads and displays categories when the page is opened", async () => {
    (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);

    renderComponent();

    expect(await screen.findByText("Electronics")).toBeInTheDocument();
    expect(await screen.findByText("Clothing")).toBeInTheDocument();

    expect(api.getCategories).toHaveBeenCalledTimes(1);
  });

  it("shows empty state message when API returns no categories", async () => {
    (api.getCategories as jest.Mock).mockResolvedValue([]);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("No categories available")
      ).toBeInTheDocument();
    });
  });

  it("logs an error when fetching categories fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    (api.getCategories as jest.Mock).mockRejectedValue(
      new Error("Fetch failed")
    );

    renderComponent();

    await waitFor(() => {
      expect(api.getCategories).toHaveBeenCalled();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching categories:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("opens delete confirmation dialog and removes category after confirming", async () => {
    (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);
    (api.deleteCategory as jest.Mock).mockResolvedValue({});

    renderComponent();

    await waitFor(() => screen.getByText("Electronics"));

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(
      screen.getByText(/Are you sure you want to delete/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(api.deleteCategory).toHaveBeenCalledWith("1");
    });

    expect(
      screen.queryByText("Electronics")
    ).not.toBeInTheDocument();
  });

  it("closes delete confirmation dialog when Cancel is clicked", async () => {
    (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);

    renderComponent();

    await screen.findByText("Electronics");

    fireEvent.click(
      screen.getAllByRole("button", { name: /delete/i })[0]
    );

    const dialogText = screen.getByText(
      /Are you sure you want to delete/i
    );

    fireEvent.click(screen.getByText("Cancel"));

    await waitForElementToBeRemoved(dialogText);
  });

  it("logs an error when deleting a category fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);
    (api.deleteCategory as jest.Mock).mockRejectedValue(
      new Error("Delete failed")
    );

    renderComponent();

    await waitFor(() => screen.getByText("Electronics"));

    fireEvent.click(
      screen.getAllByRole("button", { name: /delete/i })[0]
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(api.deleteCategory).toHaveBeenCalled();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error deleting category:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("opens Add Category modal when Add Category button is clicked", async () => {
    (api.getCategories as jest.Mock).mockResolvedValue([]);

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /add category/i }));

    const dialog = await screen.findByRole("dialog", { name: "Add" });

    expect(dialog).toBeInTheDocument();
  });

  it("opens Edit Category modal with correct title when Edit button is clicked", async () => {
    (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);

    renderComponent();

    await screen.findByText("Electronics");

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

    const editButton = deleteButtons[0].parentElement?.querySelectorAll("button")[0];

    fireEvent.click(editButton as HTMLElement);

    const dialog = await screen.findByRole("dialog");

    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("displays correct status labels for active and inactive categories", async () => {
    (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });
  });
});