import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import CustomerAddressList from "../src/components/Customers/CustomerAddressList";

describe("CustomerAddressList", () => {
  test("renders address list header", () => {
    render(<CustomerAddressList />);

    expect(screen.getByText("Address List")).toBeInTheDocument();
    expect(screen.getByText("Shipping Addresses")).toBeInTheDocument();
  });

  test("renders empty state message", () => {
    render(<CustomerAddressList />);

    expect(screen.getByText("No Address Found")).toBeInTheDocument();
  });
});
