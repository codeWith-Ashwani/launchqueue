import { StrictMode, useEffect } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { AuthProvider } from "../AuthContext";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";
vi.mock("../../api/axios");
beforeEach(() => vi.clearAllMocks());
let auth;
function Consumer() {
  const value = useAuth();
  useEffect(() => { auth = value; }, [value]);
  return <p>{value.founder?.email || "anonymous"}</p>;
}
it("shares the StrictMode session request and keeps authentication callbacks stable", async () => {
  api.get.mockResolvedValue({ data: { founder: { email: "founder@example.com" } } });
  render(<StrictMode><AuthProvider><Consumer /></AuthProvider></StrictMode>);
  const initialLogin = auth.loginWithGoogle;
  await screen.findByText("founder@example.com");
  expect(api.get).toHaveBeenCalledTimes(1);
  expect(auth.loginWithGoogle).toBe(initialLogin);
});
it("does not let a delayed startup response overwrite a newer login", async () => {
  let resolveSession;
  api.get.mockImplementation(() => new Promise((resolve) => { resolveSession = resolve; }));
  api.post.mockResolvedValue({ data: { founder: { email: "new@example.com" } } });
  render(<AuthProvider><Consumer /></AuthProvider>);
  await act(async () => auth.login("new@example.com", "password"));
  expect(auth.loading).toBe(false);
  await act(async () => resolveSession({ data: { founder: null } }));
  await waitFor(() => expect(screen.getByText("new@example.com")).toBeInTheDocument());
});
