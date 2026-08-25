import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ResetPassword from "../ResetPassword";
import api from "../../api/axios";

vi.mock("../../api/axios");

describe("ResetPassword Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderResetPassword(initialEntry = "/reset-password?token=valid-test-token") {
    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("shows error when token query parameter is missing", () => {
    renderResetPassword("/reset-password");

    expect(screen.getByText(/No reset token provided/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /request new reset link/i })).toBeInTheDocument();
  });

  it("submits new password when passwords match and token is present", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        message: "Password has been successfully reset. You can now log in.",
      },
    });

    renderResetPassword("/reset-password?token=valid-token-123");

    const inputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(inputs[0], { target: { value: "brandnewpassword123" } });
    fireEvent.change(inputs[1], { target: { value: "brandnewpassword123" } });

    const submitBtn = screen.getByRole("button", { name: /update password/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/reset-password", {
        token: "valid-token-123",
        newPassword: "brandnewpassword123",
      });
      expect(
        screen.getByText(/Password has been successfully reset/i)
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /log in with new password/i })).toBeInTheDocument();
    });
  });

  it("shows validation error when passwords do not match", async () => {
    renderResetPassword("/reset-password?token=valid-token-123");

    const inputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(inputs[0], { target: { value: "firstpassword123" } });
    fireEvent.change(inputs[1], { target: { value: "differentpassword123" } });

    const submitBtn = screen.getByRole("button", { name: /update password/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  it("displays server error when token is invalid or expired", async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { error: "Invalid or expired reset link." } },
    });

    renderResetPassword("/reset-password?token=expired-token-123");

    const inputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(inputs[0], { target: { value: "brandnewpassword123" } });
    fireEvent.change(inputs[1], { target: { value: "brandnewpassword123" } });

    const submitBtn = screen.getByRole("button", { name: /update password/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid or expired reset link/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /request a new reset link/i })).toBeInTheDocument();
    });
  });
});
