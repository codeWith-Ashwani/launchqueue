import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PersonalizedWaitlistCard from "../PersonalizedWaitlistCard";

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe("PersonalizedWaitlistCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSignupData = {
    position: 45,
    basePosition: 60,
    referralCount: 3,
    positionsGained: 15,
    refCode: "REF12345",
    email: "subscriber@launchqueue.com",
    waitlistName: "SaaS Alpha",
    milestones: [
      { referrals: 1, reward: "Early Queue Boost" },
      { referrals: 3, reward: "Beta Access" },
      { referrals: 5, reward: "Lifetime Founder Badge" },
    ],
  };

  it("renders subscriber email, queue position and referral counts", () => {
    render(<PersonalizedWaitlistCard signupData={mockSignupData} slug="saas-alpha" />);

    expect(screen.getByText("subscriber@launchqueue.com")).toBeInTheDocument();
    expect(screen.getByText("#45")).toBeInTheDocument();
    expect(screen.getByText("3 referrals")).toBeInTheDocument();
    expect(screen.getByText("↑ 15 places gained")).toBeInTheDocument();
    expect(screen.getByText("REF12345")).toBeInTheDocument();
  });

  it("correctly calculates and displays next milestone reward requirements", () => {
    render(<PersonalizedWaitlistCard signupData={mockSignupData} slug="saas-alpha" />);

    // referralCount is 3, next milestone is 5 -> needed is 2
    expect(screen.getAllByText(/Lifetime Founder Badge/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/2 more referrals needed/i)).toBeInTheDocument();
  });

  it("marks unlocked milestones with checkmark and locked milestones with circle", () => {
    render(<PersonalizedWaitlistCard signupData={mockSignupData} slug="saas-alpha" />);

    // 1 and 3 are unlocked, 5 is not
    expect(screen.getByText(/✓ Early Queue Boost/i)).toBeInTheDocument();
    expect(screen.getByText(/✓ Beta Access/i)).toBeInTheDocument();
    expect(screen.getByText(/○ Lifetime Founder Badge/i)).toBeInTheDocument();
  });

  it("handles copy referral code and referral link", async () => {
    render(<PersonalizedWaitlistCard signupData={mockSignupData} slug="saas-alpha" />);

    const copyCodeBtn = screen.getByRole("button", { name: /Copy Code/i });
    fireEvent.click(copyCodeBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("REF12345");
    expect(await screen.findByText(/Referral code copied ✓/i)).toBeInTheDocument();

    const copyLinkBtn = screen.getByRole("button", { name: /Copy Link/i });
    fireEvent.click(copyLinkBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining("ref=REF12345")
    );
  });
});
