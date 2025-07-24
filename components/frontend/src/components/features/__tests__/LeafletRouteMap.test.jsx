import React from "react";
import { render, screen } from "@testing-library/react";
import LeafletRouteMap from "../../ui/LeafletRouteMap";

describe("LeafletRouteMap", () => {
  it("renders nothing if start or end is missing", () => {
    const { container } = render(<LeafletRouteMap start={null} end={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders map if start and end are provided", () => {
    // San Francisco to Oakland
    const start = [37.7749, -122.4194];
    const end = [37.8044, -122.2711];
    render(
      <LeafletRouteMap
        start={start}
        end={end}
        startLabel="SF"
        endLabel="Oakland"
      />,
    );
    expect(screen.getByText("SF")).toBeInTheDocument();
    expect(screen.getByText("Oakland")).toBeInTheDocument();
  });
});
