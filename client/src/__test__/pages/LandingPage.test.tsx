import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import Landing from "@/routes/Landing";
import { BrowserRouter, useLocation } from "react-router-dom";

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
    expect(landingTitle.innerHTML).toContain("Wise tracking");
  });

  it("should allow navigation to the auth page", async () => {
    render(<Landing />, { wrapper: BrowserRouter });

    const { result } = renderHook(() => useLocation(), {
      wrapper: BrowserRouter,
    });

    const linkButton = await screen.findByTestId("auth-link");

    fireEvent.click(linkButton);

    expect(linkButton).toBeDefined();

    waitFor(() => {
      expect(result.current.pathname).toBe("/auth");
    });
  });
});
