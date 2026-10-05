import { describe, expect, it } from "vitest";
import api from "../axios";

describe("Browser request security header", () => {
  it.each(["get", "head", "options", "post", "patch", "delete"])("sends the CSRF header only when %s can change state", async (method) => {
    let headers;
    await api.request({ url: "/test", method, adapter: async (config) => {
      headers = config.headers;
      return { data: {}, status: 200, statusText: "OK", headers: {}, config };
    } });
    expect(headers.get("X-LaunchQueue-Request")).toBe(["get", "head", "options"].includes(method) ? undefined : "1");
  });
});
