import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SignupForm from "../SignupForm";
import api from "../../api/axios";

vi.mock("../../api/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("SignupForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it("renders email input and submit button", () => {
    render(
      <MemoryRouter>
        <SignupForm slug="test-launch" />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/name@company\.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Join the Waitlist/i })).toBeInTheDocument();
  });

  it("shows validation error on empty or invalid email submit", async () => {
    render(
      <MemoryRouter>
        <SignupForm slug="test-launch" />
      </MemoryRouter>
    );

    const form = screen.getByPlaceholderText(/name@company\.com/i).closest("form");
    fireEvent.submit(form);

    expect(
      await screen.findByText(/Please enter a valid email address/i)
    ).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("calls the API client on valid submit and invokes onSuccess callback", async () => {
    const mockSuccess = vi.fn();
    const mockResponse = {
      data: {
        position: 42,
        refCode: "TEST1234",
        email: "user@example.com",
        referralCount: 0,
      },
    };

    api.post.mockResolvedValueOnce(mockResponse);

    render(
      <MemoryRouter>
        <SignupForm slug="test-launch" onSuccess={mockSuccess} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/name@company\.com/i);
    const button = screen.getByRole("button", { name: /Join the Waitlist/i });

    fireEvent.change(input, { target: { value: "user@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/w/test-launch/signup", {
        email: "user@example.com",
        ref: undefined,
      });
      expect(mockSuccess).toHaveBeenCalledWith(mockResponse.data);
    });
  });

  it("includes referral code from URL if present", async () => {
    api.post.mockResolvedValueOnce({ data: { position: 1 } });

    render(
      <MemoryRouter initialEntries={["/?ref=FRIEND12"]}>
        <SignupForm slug="test-launch" />
      </MemoryRouter>
    );

    expect(screen.getByText(/FRIEND12/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/name@company\.com/i);
    const button = screen.getByRole("button", { name: /Join the Waitlist/i });

    fireEvent.change(input, { target: { value: "friend@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/w/test-launch/signup", {
        email: "friend@example.com",
        ref: "FRIEND12",
      });
    });
  });
});
