import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Profile from "../Profile";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

vi.mock("../../api/axios");

describe("Profile Page", () => {
  const mockUpdateFounder = vi.fn();
  const mockFounder = {
    id: "123",
    name: "Alex Founder",
    email: "alex@company.com",
    plan: "pro",
    customerPortalUrl: "https://launchqueue.lemonsqueezy.com/billing",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderProfile(founder = mockFounder) {
    return render(
      <AuthContext.Provider
        value={{
          founder,
          updateFounder: mockUpdateFounder,
          loading: false,
        }}
      >
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  }

  it("renders current founder info and subscription tier", () => {
    renderProfile();

    expect(screen.getByDisplayValue("Alex Founder")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alex@company.com")).toBeInTheDocument();
    expect(screen.getByText("pro Plan")).toBeInTheDocument();
  });

  it("submits profile edits and updates AuthContext", async () => {
    api.patch.mockResolvedValueOnce({
      data: {
        founder: {
          ...mockFounder,
          name: "Alex Senior",
          email: "alex.senior@company.com",
        },
      },
    });

    renderProfile();

    const nameInput = screen.getByDisplayValue("Alex Founder");
    fireEvent.change(nameInput, { target: { value: "Alex Senior" } });

    const saveBtn = screen.getByRole("button", { name: /save profile/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith("/auth/profile", {
        name: "Alex Senior",
        email: "alex@company.com",
      });
      expect(mockUpdateFounder).toHaveBeenCalledWith({
        ...mockFounder,
        name: "Alex Senior",
        email: "alex.senior@company.com",
      });
      expect(screen.getByText(/Profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it("submits password change when passwords match", async () => {
    api.patch.mockResolvedValueOnce({
      data: { message: "Password updated successfully!" },
    });

    renderProfile();

    const inputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(inputs[0], { target: { value: "currentPassword123" } });
    fireEvent.change(inputs[1], { target: { value: "newPassword123" } });
    fireEvent.change(inputs[2], { target: { value: "newPassword123" } });

    const updateBtn = screen.getByRole("button", { name: /update password/i });
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith("/auth/password", {
        currentPassword: "currentPassword123",
        newPassword: "newPassword123",
      });
      expect(screen.getByText(/Password updated successfully/i)).toBeInTheDocument();
    });
  });

  it("attempts to open billing portal on manage payment method click", async () => {
    const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => {});
    api.get.mockResolvedValueOnce({
      data: { portalUrl: "https://launchqueue.lemonsqueezy.com/billing" },
    });

    renderProfile();

    const manageBtn = screen.getByRole("button", { name: /manage payment method/i });
    fireEvent.click(manageBtn);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/payments/portal");
      expect(windowOpenSpy).toHaveBeenCalledWith(
        "https://launchqueue.lemonsqueezy.com/billing",
        "_blank"
      );
    });

    windowOpenSpy.mockRestore();
  });

  it("shows message when founder does not have an active subscription", async () => {
    api.get.mockRejectedValueOnce({
      response: { status: 404, data: { error: "No active customer portal found" } },
    });

    renderProfile();

    const manageBtn = screen.getByRole("button", { name: /manage payment method/i });
    fireEvent.click(manageBtn);

    await waitFor(() => {
      expect(screen.getByText(/don't have an active subscription yet/i)).toBeInTheDocument();
    });
  });
});
