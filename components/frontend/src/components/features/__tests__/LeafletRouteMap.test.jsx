import React from "react";
import { render, waitFor } from "@testing-library/react";
import LeafletRouteMap from "../../ui/LeafletRouteMap";

describe("LeafletRouteMap", () => {
  it("renders nothing if start or end is missing", () => {
    const { container } = render(<LeafletRouteMap start={null} end={null} />);
    expect(
      container.querySelector(".leaflet-container"),
    ).not.toBeInTheDocument();
  });

  it("renders map if start and end are provided", async () => {
    const { container } = render(
      <LeafletRouteMap
        start={[37.7749, -122.4194]}
        end={[37.8044, -122.2712]}
        startLabel="San Francisco"
        endLabel="Oakland"
      />,
    );
    await waitFor(() => {
      expect(container.querySelector(".leaflet-container")).toBeInTheDocument();
      expect(container.querySelectorAll(".leaflet-marker-icon")).toHaveLength(
        2,
      );
    });
  });
});
