import request from "supertest";
import { createApp } from "../src/app";

describe("app", () => {
  const originalCorsOrigin = process.env.CORS_ORIGIN;

  afterEach(() => {
    process.env.CORS_ORIGIN = originalCorsOrigin;
  });

  it("returns health check status", async () => {
    await request(createApp())
      .get("/health")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({ status: "ok" });
  });

  it("returns the root API message", async () => {
    await request(createApp()).get("/").expect(200).expect("Energy Mix API is running.");
  });

  it("allows any CORS origin when CORS_ORIGIN includes wildcard", async () => {
    process.env.CORS_ORIGIN = "http://localhost:5173,*";

    await request(createApp())
      .get("/health")
      .set("Origin", "https://example.com")
      .expect("Access-Control-Allow-Origin", "*")
      .expect(200);
  });

  it("allows origins from a comma-separated CORS_ORIGIN list", async () => {
    process.env.CORS_ORIGIN = "http://localhost:5173, https://example.com";

    await request(createApp())
      .get("/health")
      .set("Origin", "https://example.com")
      .expect("Access-Control-Allow-Origin", "https://example.com")
      .expect(200);
  });

  it("returns CORS preflight options for the API", async () => {
    process.env.CORS_ORIGIN = "https://example.com";

    await request(createApp())
      .options("/api/energy-mix")
      .set("Origin", "https://example.com")
      .set("Access-Control-Request-Method", "GET")
      .expect("Access-Control-Allow-Origin", "https://example.com")
      .expect("Access-Control-Allow-Methods", "GET")
      .expect("Access-Control-Allow-Headers", "Content-Type")
      .expect("Access-Control-Max-Age", "86400")
      .expect(204);
  });
});
