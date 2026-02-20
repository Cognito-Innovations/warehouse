import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as api from "../src/services/api.services";
import MySuite from "../src/pages/MySuite";

describe("MySuite Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(api, "getRacks").mockResolvedValue([]);
    jest.spyOn(api, "deleteRack").mockResolvedValue({ success: true });
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <MySuite />
      </MemoryRouter>
    );

  it("renders page title from TopNavbar", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: /my suite/i })
    ).toBeInTheDocument();
  });

  it("renders MySuiteHeader component correctly", () => {
    renderPage();

    expect(
      screen.getByRole("heading", {
        name: /palakart international courier/i,
      })
    ).toBeInTheDocument();
  });

  it("renders MySuiteContent component correctly", async () => {
    renderPage();

    expect(
      screen.getByRole("tab", { name: /racks/i })
    ).toBeInTheDocument();
  });
});
