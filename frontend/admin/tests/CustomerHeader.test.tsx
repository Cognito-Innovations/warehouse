import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CustomerHeader from "../src/components/Customers/CustomerHeader";
import type { User } from "../src/types";

const mockUser: User = {
  id: "123",
  name: "Test User",
  suite_no: "B202",
  email: "test@example.com",
  phone_number: "9876543210",
  dob: "1995-05-15",
  gender: "female",
  verified: true,
  is_active: false,
  identifier: "google",
  role: "ADMIN" as any,
  email_verified: true,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
};

describe("CustomerHeader - Component Tests", () => {
  test("renders basic user information", () => {
    render(<CustomerHeader user={mockUser} />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Suite: B202")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  test("renders optional fields when available", () => {
    render(<CustomerHeader user={mockUser} />);

    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("1995-05-15")).toBeInTheDocument();
    expect(screen.getByText("female")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  test("renders status chips correctly", () => {
    render(<CustomerHeader user={mockUser} />);

    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  test("renders identifier chip when present", () => {
    render(<CustomerHeader user={mockUser} />);

    expect(screen.getByText("google")).toBeInTheDocument();
  });

  test("does not render optional fields if null", () => {
    const minimalUser: User = {
      ...mockUser,
      phone_number: null,
      dob: null,
      gender: null,
      identifier: undefined,
    };

    render(<CustomerHeader user={minimalUser} />);

    expect(screen.queryByText("9876543210")).not.toBeInTheDocument();
    expect(screen.queryByText("1995-05-15")).not.toBeInTheDocument();
    expect(screen.queryByText("female")).not.toBeInTheDocument();
    expect(screen.queryByText("google")).not.toBeInTheDocument();
  });
});
