const request = require("supertest");
const app = require("../server"); // ✅ Uses the exported app, NOT listen()

describe("Basic API Health Check", () => {
  it("should return 200 OK for root route", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Employee Management API is running/i);
  });
});
