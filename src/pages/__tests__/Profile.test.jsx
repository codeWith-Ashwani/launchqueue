import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Profile from "../Profile";
import { AuthContext } from "../../context/auth-context";
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
    api.get.mockImplementation(() => Promise.resolve({ data: { campaigns: [], usage: { campaigns: 0, signups: 0, confirmed: 0 }, limits: { campaigns: 10, signups: 25000 } } }));
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
    api.get.mockImplementation((path) => Promise.resolve(path === "/payments/portal" ? {
      data: { portalUrl: "https://launchqueue.lemonsqueezy.com/billing" },
    } : { data: { campaigns: [] } }));

    renderProfile();

    const manageBtn = screen.getByRole("button", { name: /manage payment method/i });
    fireEvent.click(manageBtn);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/payments/portal");
      expect(windowOpenSpy).toHaveBeenCalledWith(
        "https://launchqueue.lemonsqueezy.com/billing",
        "_blank", "noopener,noreferrer"
      );
    });

    windowOpenSpy.mockRestore();
  });

  it("shows message when founder does not have an active subscription", async () => {
    api.get.mockImplementation((path) => path === "/payments/portal" ? Promise.reject({
      response: { status: 404, data: { error: "No active customer portal found" } },
    }) : Promise.resolve({ data: { campaigns: [] } }));

    renderProfile();

    const manageBtn = screen.getByRole("button", { name: /manage payment method/i });
    fireEvent.click(manageBtn);

    await waitFor(() => {
      expect(screen.getByText(/don't have an active subscription yet/i)).toBeInTheDocument();
    });
  });

  it("updates only the toggled row immediately, preserves counts, and never refetches the campaign overview", async () => {
    const campaigns = ["First", "Second"].map((name, i) => ({ _id: String(i), name, slug: name.toLowerCase(), discoverable: false, paused: false, signupCount: 123, confirmedCount: 100 }));
    api.get.mockResolvedValue({ data: { campaigns } });
    let finish;
    api.patch.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    renderProfile();
    const first = (await screen.findByText("First")).closest("article");
    const second = screen.getByText("Second").closest("article");
    fireEvent.click(within(first).getByRole("button", { name: "List on discovery" }));
    expect(within(first).getByText("On the discovery board")).toBeInTheDocument();
    expect(within(first).getByRole("button", { name: "Remove from discovery" })).toBeDisabled();
    expect(within(second).getByRole("button", { name: "List on discovery" })).toBeEnabled();
    expect(screen.queryByText("Loading your campaigns…")).not.toBeInTheDocument();
    await act(async () => finish({ data: { waitlist: { discoverable: true, discoveryHidden: false } } }));
    expect(screen.getByText("First").closest("article")).toBe(first);
    expect(screen.getByText("Second").closest("article")).toBe(second);
    expect(within(first).getByText("123")).toBeInTheDocument();
    expect(api.get.mock.calls.filter(([path]) => path === "/auth/overview")).toHaveLength(1);
  });

  it("rolls back a failed toggle without affecting a concurrent save on another campaign", async () => {
    api.get.mockResolvedValue({ data: { campaigns: ["First", "Second"].map((name, i) => ({ _id: String(i), name, slug: name.toLowerCase(), discoverable: false, paused: false, signupCount: 0, confirmedCount: 0 })) } });
    const pending = {};
    api.patch.mockImplementation((path) => new Promise((resolve, reject) => { pending[path] = { resolve, reject }; }));
    renderProfile();
    const first = (await screen.findByText("First")).closest("article");
    const second = screen.getByText("Second").closest("article");
    fireEvent.click(within(first).getByRole("button", { name: "List on discovery" }));
    fireEvent.click(within(second).getByRole("button", { name: "List on discovery" }));
    await act(async () => pending["/waitlists/0"].reject({ response: { data: { error: "Save failed" } } }));
    expect(within(first).getByRole("alert")).toHaveTextContent("Save failed");
    expect(within(first).getByText("Unlisted")).toBeInTheDocument();
    expect(within(second).getByRole("button", { name: "Remove from discovery" })).toBeDisabled();
    await act(async () => pending["/waitlists/1"].resolve({ data: { waitlist: { discoverable: true } } }));
    expect(within(second).getByRole("button", { name: "Remove from discovery" })).toBeEnabled();
    expect(within(first).getByRole("button", { name: "List on discovery" })).toBeEnabled();
  });
});
