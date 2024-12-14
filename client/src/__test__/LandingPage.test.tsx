import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Landing from "@/routes/Landing";
import { BrowserRouter } from "react-router-dom";

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});
describe("LandingPage", () => {
  it("should render the title of the page", async () => {
    render(<Landing />, { wrapper: BrowserRouter });

    const landingTitle = await screen.findByTestId("landing-title");

    expect(landingTitle).toBeDefined();
    expect(landingTitle.innerHTML).string("Wise tracking and saving with ease");
  });
});
