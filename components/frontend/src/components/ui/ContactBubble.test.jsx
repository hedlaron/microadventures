import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactBubble from "./ContactBubble";

describe("ContactBubble Component", () => {
  it("renders without crashing", () => {
    render(<ContactBubble />);
    expect(screen.getByText(/Love what you see/)).toBeInTheDocument();
  });

  it("displays the welcome message", () => {
    render(<ContactBubble />);
    expect(
      screen.getByText(
        "Love what you see? Let's build something amazing together!",
      ),
    ).toBeInTheDocument();
  });

  it("shows the waving emoji", () => {
    render(<ContactBubble />);
    expect(screen.getByText("👋")).toBeInTheDocument();
  });

  it("displays LinkedIn connection link", () => {
    render(<ContactBubble />);
    const linkedinLink = screen.getByRole("link", {
      name: /connect on linkedin/i,
    });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://linkedin.com/in/hedlaron",
    );
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has a close button", () => {
    render(<ContactBubble />);
    const closeButton = screen.getByRole("button", { name: "×" });
    expect(closeButton).toBeInTheDocument();
  });

  it("closes when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<ContactBubble />);

    const closeButton = screen.getByRole("button", { name: "×" });
    const welcomeMessage = screen.getByText(/Love what you see/);

    expect(welcomeMessage).toBeInTheDocument();

    await user.click(closeButton);

    expect(screen.queryByText(/Love what you see/)).not.toBeInTheDocument();
  });

  it("applies proper styling classes", () => {
    render(<ContactBubble />);

    // Check for fixed positioning and z-index
    const container = screen.getByText(/Love what you see/).closest(".fixed");
    expect(container).toHaveClass("fixed", "bottom-20", "right-6", "z-40");
  });

  it("has gradient styling", () => {
    render(<ContactBubble />);

    const bubbleContent = screen
      .getByText(/Love what you see/)
      .closest('[class*="bg-gradient"]');
    expect(bubbleContent).toHaveClass(
      "bg-gradient-to-br",
      "from-green-400",
      "to-emerald-500",
    );
  });

  it("LinkedIn link has proper styling", () => {
    render(<ContactBubble />);

    const linkedinLink = screen.getByRole("link", {
      name: /connect on linkedin/i,
    });
    expect(linkedinLink).toHaveClass(
      "bg-gradient-to-r",
      "from-blue-600",
      "to-blue-700",
      "hover:from-blue-700",
      "hover:to-blue-800",
    );
  });

  it("close button has proper styling", () => {
    render(<ContactBubble />);

    const closeButton = screen.getByRole("button", { name: "×" });
    expect(closeButton).toHaveClass(
      "bg-white",
      "hover:bg-gray-100",
      "text-emerald-600",
      "rounded-full",
      "w-8",
      "h-8",
    );
  });

  it("contains LinkedIn SVG icon", () => {
    render(<ContactBubble />);

    const svgIcon = screen
      .getByRole("link", { name: /connect on linkedin/i })
      .querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveClass("w-4", "h-4");
  });

  it("shows bubble by default", () => {
    render(<ContactBubble />);
    expect(screen.getByText(/Love what you see/)).toBeInTheDocument();
  });

  it("hides entire component when closed", async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactBubble />);

    expect(container.firstChild).not.toBeNull();

    const closeButton = screen.getByRole("button", { name: "×" });
    await user.click(closeButton);

    expect(container.firstChild).toBeNull();
  });

  it("has animation classes", () => {
    render(<ContactBubble />);

    const container = screen
      .getByText(/Love what you see/)
      .closest(".animate-bounce-once");
    expect(container).toHaveClass("animate-bounce-once");

    const bubbleContent = screen
      .getByText(/Love what you see/)
      .closest('[class*="animate-fade-in"]');
    expect(bubbleContent).toHaveClass("animate-fade-in");
  });

  it("emoji has animation class", () => {
    render(<ContactBubble />);

    const emoji = screen.getByText("👋");
    expect(emoji).toHaveClass("animate-wave-constant");
  });
});
