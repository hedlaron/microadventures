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

  it("renders without crashing", () => {
    render(<About onClose={() => {}} />);
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const mockClose = vi.fn();
    render(<About onClose={mockClose} />);

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalled();
  });

  it("displays version information", () => {
    render(<About onClose={() => {}} />);
    expect(screen.getByText("Frontend Version")).toBeInTheDocument();
    expect(screen.getByText("Backend Version")).toBeInTheDocument();
  });
});
