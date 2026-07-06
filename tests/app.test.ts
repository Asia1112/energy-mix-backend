import request from "supertest";
import { createApp } from "../src/app";

describe("app", () => {
  it("returns health check status", async () => {
    await request(createApp())
      .get("/health")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({ status: "ok" });
  });
});
