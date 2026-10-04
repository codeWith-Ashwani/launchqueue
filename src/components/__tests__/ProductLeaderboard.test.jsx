import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductLeaderboard from "../ProductLeaderboard";
import api from "../../api/axios";
vi.mock("../../api/axios");
const data = { updatedAt: "2026-10-04", products: [{ slug: "orbit", name: "Orbit", description: "A maker workspace", rank: 1, members: 15, weeklyMembers: 4, accentColor: "#7555aa" }] };
describe("Product discovery", () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it("links real products and fetches the selected ranking period", async () => {
    api.get.mockResolvedValue({ data });
    render(<MemoryRouter><ProductLeaderboard /></MemoryRouter>);
    expect(await screen.findByRole("link", { name: /Orbit/ })).toHaveAttribute("href", "/w/orbit");
    expect(screen.getByText("4")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "All time" }));
    await waitFor(() => expect(api.get).toHaveBeenLastCalledWith("/discover/leaderboard", expect.objectContaining({ params: { period: "all" } })));
    expect(await screen.findByText("15")).toBeInTheDocument();
  });
  it("offers a retry after a failure without displaying fabricated rankings", async () => {
    api.get.mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce({ data });
    render(<MemoryRouter><ProductLeaderboard /></MemoryRouter>);
    expect(await screen.findByRole("alert")).toHaveTextContent("couldn’t load");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("link", { name: /Orbit/ })).toBeInTheDocument();
  });
  it("shows an honest empty state when there are no public products", async () => {
    api.get.mockResolvedValue({ data: { products: [] } });
    render(<MemoryRouter><ProductLeaderboard /></MemoryRouter>);
    expect(await screen.findByText("A little early? Perfect.")).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Product rankings" })).not.toBeInTheDocument();
  });
});
