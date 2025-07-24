import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LocationAutocomplete from "../LocationAutocomplete";

describe("LocationAutocomplete", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders input and placeholder", () => {
    render(
      <LocationAutocomplete
        value=""
        onChange={() => {}}
        placeholder="Type location..."
      />,
    );
    expect(screen.getByPlaceholderText("Type location...")).toBeInTheDocument();
  });

  it("shows suggestions when typing 3+ chars and hides on click", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => [
        { place_id: 1, display_name: "Budapest, Hungary" },
        { place_id: 2, display_name: "Budapest Airport" },
      ],
    });
    const handleChange = vi.fn();
    render(<LocationAutocomplete value="" onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    // Simulate user typing each character
    fireEvent.change(input, { target: { value: "B" } });
    fireEvent.change(input, { target: { value: "Bu" } });
    fireEvent.change(input, { target: { value: "Bud" } });

    // Wait for all suggestions to appear, then select the correct one
    const suggestions = await screen.findAllByRole("option");
    const budapestOption = suggestions.find((el) =>
      el.textContent.includes("Budapest, Hungary"),
    );
    expect(budapestOption).toBeInTheDocument();
    fireEvent.click(budapestOption);
    expect(handleChange).toHaveBeenCalledWith("Budapest, Hungary");
    await waitFor(() => {
      expect(screen.queryByRole("option")).not.toBeInTheDocument();
    });
  });

  it("does not show suggestions for <3 chars", async () => {
    global.fetch = vi.fn();
    render(<LocationAutocomplete value="Bu" onChange={() => {}} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Bu" } });
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("shows loading spinner when loading", async () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    render(<LocationAutocomplete value="" onChange={() => {}} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "B" } });
    fireEvent.change(input, { target: { value: "Bu" } });
    fireEvent.change(input, { target: { value: "Bud" } });
    // Wait for the spinner to appear
    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  // New test case for suggestion click
  it("calls onChange with the correct value when a suggestion is clicked", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => [
        { place_id: 1, display_name: "Budapest, Hungary" },
        { place_id: 2, display_name: "Budapest Airport" },
      ],
    });
    const handleChange = vi.fn();
    render(<LocationAutocomplete value="" onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "B" } });
    fireEvent.change(input, { target: { value: "Bu" } });
    fireEvent.change(input, { target: { value: "Bud" } });

    // Wait for all suggestions to appear, then select the correct one
    const suggestions = await screen.findAllByRole("option");
    const budapestOption = suggestions.find((el) =>
      el.textContent.includes("Budapest, Hungary"),
    );
    expect(budapestOption).toBeInTheDocument();
    fireEvent.click(budapestOption);
    expect(handleChange).toHaveBeenCalledWith("Budapest, Hungary");
  });
});
