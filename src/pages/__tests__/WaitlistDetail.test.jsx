import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import WaitlistDetail from "../WaitlistDetail";
import api from "../../api/axios";

vi.mock("../../api/axios");

describe("WaitlistDetail Page - CSV Export, Admin Controls & Funnel Analytics", () => {
  const mockStatsWithSignups = {
    waitlist: {
      _id: "waitlist123",
      name: "Early Beta Launch",
      slug: "early-beta",
    },
    totalVisitors: 150,
    totalSignups: 2,
    conversionRate: 17,
    signupsToday: 1,
    referralRate: 50,
    topReferrers: [],
    signups: [
      {
        _id: "sub_1",
        email: "alice@test.com",
        currentPosition: 1,
        referralCount: 2,
        status: "waiting",
      },
      {
        _id: "sub_2",
        email: "bob@test.com",
        currentPosition: 2,
        referralCount: 0,
        status: "invited",
      },
    ],
    chartData: [],
  };

  const mockFunnelData = {
    totalPageViews: 200,
    totalSignups: 50,
    conversionRate: 25,
    directSignups: 30,
    referredSignups: 20,
    topReferrers: [
      {
        _id: "sub_1",
        email: "alice@test.com",
        referralCount: 2,
        currentPosition: 1,
        status: "waiting",
      },
    ],
  };

  const mockStatsZeroSignups = {
    waitlist: {
      _id: "waitlist123",
      name: "Early Beta Launch",
      slug: "early-beta",
    },
    totalVisitors: 0,
    totalSignups: 0,
    conversionRate: 0,
    signupsToday: 0,
    referralRate: 0,
    topReferrers: [],
    signups: [],
    chartData: [],
  };

  const mockFunnelZeroData = {
    totalPageViews: 0,
    totalSignups: 0,
    conversionRate: 0,
    directSignups: 0,
    referredSignups: 0,
    topReferrers: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPage() {
    return render(
      <MemoryRouter initialEntries={["/dashboard/waitlist123"]}>
        <Routes>
          <Route path="/dashboard/:id" element={<WaitlistDetail />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("renders stats, funnel metrics and enables Export CSV button when signups exist", async () => {
    api.get.mockImplementation((url) => {
      if (url.includes("/stats")) {
        return Promise.resolve({ data: mockStatsWithSignups });
      }
      if (url.includes("/funnel")) {
        return Promise.resolve({ data: mockFunnelData });
      }
      return Promise.reject(new Error("not found"));
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Early Beta Launch")).toBeInTheDocument();
      expect(screen.getAllByText("alice@test.com").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("bob@test.com").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("200")).toBeInTheDocument(); // Page Views
      expect(screen.getByText("25%")).toBeInTheDocument(); // Funnel Conversion
    });

    const exportBtn = screen.getByRole("button", { name: /export signups as csv/i });
    expect(exportBtn).toBeInTheDocument();
    expect(exportBtn).not.toBeDisabled();
  });

  it("handles zero page views gracefully without NaN or errors", async () => {
    api.get.mockImplementation((url) => {
      if (url.includes("/stats")) {
        return Promise.resolve({ data: mockStatsZeroSignups });
      }
      if (url.includes("/funnel")) {
        return Promise.resolve({ data: mockFunnelZeroData });
      }
      return Promise.reject(new Error("not found"));
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Early Beta Launch")).toBeInTheDocument();
      expect(screen.getAllByText("0%").length).toBeGreaterThanOrEqual(1);
    });

    const exportBtn = screen.getByRole("button", { name: /export signups as csv/i });
    expect(exportBtn).toBeDisabled();
  });

  it("allows inline position editing and submits PATCH request", async () => {
    api.get.mockImplementation((url) => {
      if (url.includes("/stats")) {
        return Promise.resolve({ data: mockStatsWithSignups });
      }
      if (url.includes("/funnel")) {
        return Promise.resolve({ data: mockFunnelData });
      }
      return Promise.reject(new Error("not found"));
    });

    api.patch.mockResolvedValueOnce({
      data: { signup: { ...mockStatsWithSignups.signups[0], currentPosition: 10 } },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText("alice@test.com").length).toBeGreaterThanOrEqual(1);
    });

    const editBtns = screen.getAllByRole("button", { name: /edit position/i });
    fireEvent.click(editBtns[0]);

    const posInput = screen.getByLabelText("Edit position input");
    fireEvent.change(posInput, { target: { value: "10" } });

    const saveBtn = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith(
        "/waitlists/waitlist123/signups/sub_1/position",
        { currentPosition: 10 }
      );
    });
  });

  it("disables batch invite when zero selected, enables upon selection, and sends batch invite", async () => {
    api.get.mockImplementation((url) => {
      if (url.includes("/stats")) {
        return Promise.resolve({ data: mockStatsWithSignups });
      }
      if (url.includes("/funnel")) {
        return Promise.resolve({ data: mockFunnelData });
      }
      return Promise.reject(new Error("not found"));
    });

    api.post.mockResolvedValueOnce({
      data: { invitedCount: 1 },
    });

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText("alice@test.com").length).toBeGreaterThanOrEqual(1);
    });

    const inviteBtn = screen.getByRole("button", { name: /batch invite selected/i });
    expect(inviteBtn).toBeDisabled();

    // Select Alice
    const checkbox = screen.getByLabelText("Select alice@test.com");
    fireEvent.click(checkbox);

    expect(inviteBtn).not.toBeDisabled();
    expect(inviteBtn).toHaveTextContent("Batch Invite Selected (1)");

    fireEvent.click(inviteBtn);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(api.post).toHaveBeenCalledWith(
        "/waitlists/waitlist123/signups/batch-invite",
        { signupIds: ["sub_1"] }
      );
    });

    confirmSpy.mockRestore();
  });
});
