import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import CheckStatusModal from "../CheckStatusModal";
import api from "../../api/axios";
vi.mock("../../api/axios", () => ({ default: { post: vi.fn() } }));

it("requests a private email link without performing a public rank lookup", async () => {
  api.post.mockResolvedValue({ data: { message: "Check your inbox for your private link." } });
  render(<CheckStatusModal isOpen slug="demo" onClose={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText("name@company.com"), { target: { value: "USER@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: "Email My Status Link" }));
  await waitFor(() => expect(api.post).toHaveBeenCalledWith("/w/demo/status-link", { email: "user@example.com" }));
  expect(await screen.findByRole("status")).toHaveTextContent("Check your inbox");
});
