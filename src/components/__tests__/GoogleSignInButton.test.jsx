import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GoogleSignInButton from "../GoogleSignInButton";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

vi.mock("../../api/axios");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("GoogleSignInButton Component", () => {
  const mockLoginWithGoogle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.VITE_GOOGLE_CLIENT_ID = "mock-google-client-id.apps.googleusercontent.com";
  });

  function renderComponent() {
    return render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            founder: null,
            loginWithGoogle: mockLoginWithGoogle,
          }}
        >
          <GoogleSignInButton text="signin_with" />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  }

  it("initializes GSI and renders the Google sign in button", () => {
    const initializeMock = vi.fn();
    const renderButtonMock = vi.fn();

    window.google = {
      accounts: {
        id: {
          initialize: initializeMock,
          renderButton: renderButtonMock,
        },
      },
    };

    renderComponent();

    expect(initializeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: "mock-google-client-id.apps.googleusercontent.com",
      })
    );
    expect(renderButtonMock).toHaveBeenCalled();
  });

  it("sends credential to /auth/google, calls loginWithGoogle, and navigates to /dashboard", async () => {
    let capturedCallback;

    window.google = {
      accounts: {
        id: {
          initialize: vi.fn(({ callback }) => {
            capturedCallback = callback;
          }),
          renderButton: vi.fn(),
        },
      },
    };

    api.post.mockResolvedValueOnce({
      data: {
        founder: {
          id: "google_founder_1",
          email: "googleuser@test.com",
          name: "Google User",
          plan: "free",
        },
      },
    });

    renderComponent();

    expect(capturedCallback).toBeDefined();

    // Simulate Google credential callback
    await capturedCallback({ credential: "mock_google_id_token" });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/google", {
        credential: "mock_google_id_token",
      });
      expect(mockLoginWithGoogle).toHaveBeenCalledWith({
        id: "google_founder_1",
        email: "googleuser@test.com",
        name: "Google User",
        plan: "free",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays error message if backend returns an error", async () => {
    let capturedCallback;

    window.google = {
      accounts: {
        id: {
          initialize: vi.fn(({ callback }) => {
            capturedCallback = callback;
          }),
          renderButton: vi.fn(),
        },
      },
    };

    api.post.mockRejectedValueOnce({
      response: { data: { error: "Google email is not verified" } },
    });

    renderComponent();

    await capturedCallback({ credential: "unverified_token" });

    await waitFor(() => {
      expect(screen.getByText("Google email is not verified")).toBeInTheDocument();
    });
  });
});
