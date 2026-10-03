import { StrictMode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import WaitlistPage from "../WaitlistPage";
import api from "../../api/axios";
vi.mock("../../api/axios", () => ({ default: { get: vi.fn(), post: vi.fn() } }));
vi.mock("../../hooks/useWaitlist", () => ({ useWaitlist: () => ({ waitlist: { name: "Demo", slug: "demo", totalSignups: 0 } }) }));
vi.mock("../../components/PersonalizedWaitlistCard", () => ({ default: ({ signupData }) => <p>Verified: {signupData.email}</p> }));
vi.mock("../../components/LiveActivityFeed", () => ({ default: () => null }));
beforeEach(() => {
  vi.clearAllMocks(); localStorage.clear(); sessionStorage.clear();
  window.history.replaceState(null, "", "/w/demo#verify=private-proof");
  api.get.mockResolvedValue({ data: { leaderboard: [] } });
  api.post.mockImplementation((url) => url.endsWith("/verify") ? Promise.resolve({ data: { email: "owned@example.com", statusToken: "private-status" } }) : Promise.resolve({ data: {} }));
});
function show() {
  render(<StrictMode><MemoryRouter initialEntries={["/w/demo"]}><Routes><Route path="/w/:slug" element={<WaitlistPage />} /></Routes></MemoryRouter></StrictMode>);
}
describe("Verification link handling", () => {
  it("consumes a fragment, verifies once in StrictMode and stores the private session", async () => {
    show();
    expect(await screen.findByText("Verified: owned@example.com")).toBeInTheDocument();
    expect(api.post.mock.calls.filter(([url]) => url.endsWith("/verify"))).toEqual([["/w/demo/verify", { token: "private-proof" }]]);
    expect(window.location.hash).toBe("");
    expect(JSON.parse(localStorage.getItem("lq_user_signup_demo")).statusToken).toBe("private-status");
  });
  it("shows recovery instructions for expired links", async () => {
    api.post.mockImplementation((url) => url.endsWith("/verify") ? Promise.reject(new Error("Expired")) : Promise.resolve({ data: {} }));
    show();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("invalid or expired"));
    expect(localStorage.getItem("lq_user_signup_demo")).toBeNull();
  });
});
