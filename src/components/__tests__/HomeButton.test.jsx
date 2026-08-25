import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomeButton from "../HomeButton";

describe("HomeButton Component", () => {
  it("renders a link to the homepage", () => {
    render(
      <BrowserRouter>
        <HomeButton />
      </BrowserRouter>
    );

    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
