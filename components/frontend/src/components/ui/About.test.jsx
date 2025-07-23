import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import About from "./About";

// Mock fetch globally
global.fetch = vi.fn();

describe("About Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockRejectedValue(new Error("API not available"));
  });

  it("renders without crashing and shows key elements", () => {
    render(<About onClose={() => {}} />);
    // Title (may appear more than once)
    expect(screen.getAllByText(/Microadventures/i).length).toBeGreaterThan(0);
    // LinkedIn button
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toBeInTheDocument();
    // GitHub button
    expect(
      screen.getByRole("link", { name: /GitHub Repo/i }),
    ).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const mockClose = vi.fn();
    render(<About onClose={mockClose} />);
    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking outside the modal (backdrop)", () => {
    const mockClose = vi.fn();
    render(<About onClose={mockClose} />);
    // The backdrop is the div with aria-hidden="true"
    const backdrop = screen.getByTestId("about-backdrop");
    fireEvent.click(backdrop);
    expect(mockClose).toHaveBeenCalled();
  });

  it("displays version information", () => {
    render(<About onClose={() => {}} />);
    expect(screen.getByText("Frontend Version")).toBeInTheDocument();
    expect(screen.getByText("Backend Version")).toBeInTheDocument();
  });
});
