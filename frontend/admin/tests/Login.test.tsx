import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as auth from "../src/hooks/useAuth";
import Login from "../src/pages/Login";

jest.mock("sonner", () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
  },
}));

import { toast } from "sonner";

jest.mock("../src/hooks/useAuth");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../src/components/Login/LoginForm", () => ({
  __esModule: true,
  default: (props) => (
    <button
      onClick={() =>
        props.onSubmit("test@example.com", "Test#123")
      }
    >
      Login Button
    </button>
  ),
}));

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

  it("should show loader when auth is loading", () => {
    (auth.useAuth as jest.Mock).mockReturnValue({
      isLoading: true,
      login: jest.fn(),
    });

    renderPage();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should render login form when not loading", () => {
    (auth.useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      login: jest.fn(),
    });

    renderPage();

    expect(screen.getByText("Login Button")).toBeInTheDocument();
  });

  it("should login, show toast and navigate on submit", async () => {
    const mockLogin = jest.fn().mockResolvedValue({});

    (auth.useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      login: mockLogin,
    });

    renderPage();

    fireEvent.click(screen.getByText("Login Button"));

    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith(
        "test@example.com",
        "Test#123"
      )
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Login successful!"
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        "/packages/all",
        { replace: true }
      );
    });
  });

  it("should not show toast or navigate if login fails", async () => {
    const mockLogin = jest
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    (auth.useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      login: mockLogin,
    });

    renderPage();

    fireEvent.click(screen.getByText("Login Button"));
  
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalled()
    );

    expect(toast.success).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
