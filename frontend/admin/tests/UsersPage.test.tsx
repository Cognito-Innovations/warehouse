import { render, screen } from "@testing-library/react";

import * as auth from "../src/hooks/useAuth";
import UsersPage from "../src/pages/UsersPage";
import { MemoryRouter } from "react-router-dom";

jest.mock("../src/hooks/useAuth");

describe("UsersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  
    (auth.useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, name: "Admin" },
      isAuthenticated: true,
      logout: jest.fn(),
    });
  });

  it("renders TopNavbar and UserCreateForm", () => {
    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/add new user/i)).toBeInTheDocument();
  });
});
