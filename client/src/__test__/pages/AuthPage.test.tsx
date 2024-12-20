import { describe, beforeEach, expect, it, vi } from "vitest";
import AuthPage from "@/routes/auth/AuthPage";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { supabase } from "@/utils/UserContext";

vi.mock("@/utils/UserContext");

describe("AuthPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("should render the email and password fields by default", () => {
    render(<AuthPage />, {
      wrapper: BrowserRouter,
    });

    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");

    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
  });

  it("should not render the username field by default", async () => {
    render(<AuthPage />, {
      wrapper: BrowserRouter,
    });
    const usernameInput = screen.queryByPlaceholderText("username");
    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");

    expect(usernameInput).toBeNull();
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
  });

  it("should render the username, email and password forms when the user clicks on the sign up button", async () => {
    render(<AuthPage />, {
      wrapper: BrowserRouter,
    });

    const signUpButton = await screen.findByTestId("SIGN UP");

    expect(signUpButton).toBeDefined();

    fireEvent.click(signUpButton);

    const usernameInput = screen.getByPlaceholderText("username");
    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");

    expect(usernameInput).not.toBeNull();
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
  });

  it("should update values for email and password when the user types in the input fields", async () => {
    render(<AuthPage />, {
      wrapper: BrowserRouter,
    });

    const sampleEmail = "testemail@gmail.com";
    const samplePassword = "password123";

    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");

    fireEvent.change(emailInput, { target: { value: sampleEmail } });
    fireEvent.change(passwordInput, { target: { value: samplePassword } });

    expect(emailInput).toHaveProperty("value", sampleEmail);
    expect(passwordInput).toHaveProperty("value", samplePassword);
  });

  it("should update values for username, email and password when the user types in the input fields", async () => {
    render(<AuthPage />, {
      wrapper: BrowserRouter,
    });

    const sampleUserName = "testuser";
    const sampleEmail = "testemail@gmail.com";
    const samplePassword = "password123";

    const signUpButton = await screen.findByTestId("SIGN UP");

    fireEvent.click(signUpButton);

    const usernameInput = screen.queryByPlaceholderText("username");
    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");

    fireEvent.change(emailInput, { target: { value: sampleEmail } });
    fireEvent.change(passwordInput, { target: { value: samplePassword } });
    fireEvent.change(usernameInput!, { target: { value: sampleUserName } });

    expect(usernameInput).toHaveProperty("value", sampleUserName);
    expect(emailInput).toHaveProperty("value", sampleEmail);
    expect(passwordInput).toHaveProperty("value", samplePassword);
  });

  it("should run supabase.auth.signInWithPassword when the user clicks on the submit button for logging in", async () => {
    render(<AuthPage />, {
      wrapper: BrowserRouter,
    });

    const sampleEmail = "testemail@gmail.com";
    const samplePassword = "password123";

    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");

    const submitButton = await screen.findByTestId("submit");
    expect(submitButton).toBeDefined();

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: sampleEmail } });
      fireEvent.change(passwordInput, { target: { value: samplePassword } });
      fireEvent.click(submitButton);
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: sampleEmail,
      password: samplePassword,
    });

    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it("should run supabase.auth.signUp when the user clicks on the submit button for signing up", async () => {
    render(<AuthPage />, {
      wrapper: BrowserRouter,
    });
    const signUpButton = await screen.findByTestId("SIGN UP");

    const sampleUserName = "testuser";
    const sampleEmail = "testemail@gmail.com";
    const samplePassword = "password123";
    fireEvent.click(signUpButton);

    const usernameInput = screen.getByPlaceholderText("username");
    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");

    const submitButton = await screen.findByTestId("submit");

    expect(usernameInput).not.toBeNull();

    await act(async () => {
      fireEvent.change(usernameInput, {
        target: { value: sampleUserName },
      });
      fireEvent.change(emailInput, {
        target: { value: sampleEmail },
      });
      fireEvent.change(passwordInput, {
        target: { value: samplePassword },
      });
      fireEvent.click(submitButton);
    });

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: sampleEmail,
      password: samplePassword,
    });

    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });
});
