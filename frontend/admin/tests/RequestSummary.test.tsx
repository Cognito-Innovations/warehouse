import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import RequestSummary from "../src/components/common/RequestSummary";

const summaryConfig = [
  {
    title: "Requested",
    status: "REQUESTED",
    icon: <div />,
    bgColor: "#fff",
  },
  {
    title: "Picked",
    status: "PICKED",
    icon: <div />,
    bgColor: "#fff",
  },
];

const mockRequests = [
  { status: "REQUESTED" },
  { status: "PICKED" },
  { status: "PICKED" },
];

describe("RequestSummary Component", () => {
  test("shows loading skeleton", () => {
    render(
      <RequestSummary
        requests={[]}
        loading={true}
        summaryConfig={summaryConfig}
        onCardClick={jest.fn()}
        selectedStatus={null}
      />
    );

    expect(screen.getByTestId("request-summary-loading")).toBeInTheDocument();
  });

  test("renders correct counts", () => {
    render(
      <RequestSummary
        requests={mockRequests}
        loading={false}
        summaryConfig={summaryConfig}
        onCardClick={jest.fn()}
        selectedStatus={null}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("calls onCardClick when card clicked", async () => {
    const onCardClick = jest.fn();

    render(
      <RequestSummary
        requests={mockRequests}
        loading={false}
        summaryConfig={summaryConfig}
        onCardClick={onCardClick}
        selectedStatus={null}
      />
    );

    await userEvent.click(screen.getByText("Requested"));
    expect(onCardClick).toHaveBeenCalled();
  });
});
