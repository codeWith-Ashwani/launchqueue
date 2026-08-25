import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ForgotPassword from "../ForgotPassword";
import api from "../../api/axios";

vi.mock("../../api/axios");

describe("ForgotPassword Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderForgotPassword() {
    return render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
  }

  it("renders email input and submit button", () => {
    renderForgotPassword();

    expect(screen.getByPlaceholderText("founder@company.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("submits email and displays generic success message", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        message: "If an account exists for this email, a reset link has been sent.",
      },
    });

    renderForgotPassword();

    const emailInput = screen.getByPlaceholderText("founder@company.com");
    fireEvent.change(emailInput, { target: { value: "founder@example.com" } });

    const submitBtn = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/forgot-password", {
        email: "founder@example.com",
      });
      expect(
        screen.getByText(/If an account exists for this email, a reset link has been sent/i)
      ).toBeInTheDocument();
    });
  });

  it("displays error message on submission failure", async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { error: "Please enter a valid email address" } },
    });

    renderForgotPassword();

    const emailInput = screen.getByPlaceholderText("founder@company.com");
    fireEvent.change(emailInput, { target: { value: "test@company.com" } });

    const submitBtn = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });
});
