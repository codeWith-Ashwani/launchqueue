import { useState } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CampaignDesigner from "../CampaignDesigner";
import CampaignPage from "../CampaignPage";
import { editableCampaign, defaultPageDesign, foreground } from "../../utils/campaignDesign";
import api from "../../api/axios";
vi.mock("../../api/axios", () => ({ default: { post: vi.fn() } }));
const draft = { heroHeadline: "A quieter way to build.", heroSubheadline: "For independent makers", ctaText: "Join the studio", accentColor: "#476344", features: [], pageDesign: { ...defaultPageDesign(), layout: "editorial", fontFamily: "serif", backgroundColor: "#f6f2e9", sectionOrder: ["story", "faq"], story: { title: "Our beginnings", body: "A space for focused projects." }, faq: [{ question: "Who is this for?", answer: "Independent makers." }] } };
function Harness() { const [value, setValue] = useState(() => editableCampaign({ heroHeadline: "Original headline" })); return <CampaignDesigner value={value} onChange={setValue} name="Maker Studio" description="A workspace for independent makers" />; }
beforeEach(() => { vi.clearAllMocks(); api.post.mockResolvedValue({ data: { design: draft } }); });
const show = () => render(<MemoryRouter><Harness /></MemoryRouter>);
describe("Campaign design studio", () => {
  it("generates an editable preview without publishing and supports undo", async () => {
    const { container } = show();
    fireEvent.change(screen.getByLabelText("Your brand direction"), { target: { value: "Calm editorial page in olive and cream" } });
    fireEvent.click(screen.getByRole("button", { name: /Generate branded page/ }));
    expect(await screen.findByText(/Your AI draft is ready/)).toBeInTheDocument();
    expect(screen.getByLabelText("Headline")).toHaveValue(draft.heroHeadline);
    expect(container.querySelector(".campaign-page")).toHaveAttribute("data-layout", "editorial");
    expect(api.post.mock.calls[0][0]).toBe("/waitlists/design"); expect(api.post).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Undo AI draft" }));
    expect(screen.getByLabelText("Headline")).toHaveValue("Original headline");
  });
  it("preserves the current design when the free-tier provider fails", async () => {
    api.post.mockRejectedValue({ response: { data: { error: "Gemini limit reached" } } }); show();
    fireEvent.change(screen.getByLabelText("Your brand direction"), { target: { value: "Calm editorial page in olive and cream" } });
    fireEvent.click(screen.getByRole("button", { name: /Generate branded page/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Gemini limit reached");
    expect(screen.getByLabelText("Headline")).toHaveValue("Original headline");
  });
  it("changes layouts, sections and preview size without calling AI", () => {
    const { container } = show();
    fireEvent.change(screen.getByLabelText("Page layout"), { target: { value: "split" } });
    expect(container.querySelector(".campaign-page")).toHaveAttribute("data-layout", "split");
    fireEvent.click(screen.getByLabelText("Leaderboard"));
    expect(container.querySelector('[data-section="leaderboard"]')).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Mobile" }));
    expect(container.querySelector(".designer-preview-mobile")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });
  it("renders model text as text and rejects unsafe image URLs", () => {
    const { container } = render(<MemoryRouter><CampaignPage campaign={{ name: "Safe", ...draft, heroHeadline: "<script>alert('x')</script>", heroImageUrl: "javascript:alert(1)" }} preview /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("<script>alert('x')</script>");
    expect(container.querySelector("script")).toBeNull(); expect(container.querySelector("img")).toBeNull();
    expect(foreground("#ffffff")).toBe("#000000"); expect(foreground("#000000")).toBe("#ffffff");
  });
});
