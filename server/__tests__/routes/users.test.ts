import request from "supertest";
import { app } from "../../index";

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { Pool } from "pg";

vi.mock("pg", () => {
  const mPool = {
    query: vi.fn(),
    connect: vi.fn(() => ({
      query: vi.fn(),
      release: vi.fn(),
    })),
    end: vi.fn(),
  };
  return { Pool: vi.fn(() => mPool) };
});

let testPool = new Pool();

beforeEach(async () => {
  testPool = new Pool();

  await testPool.query('TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;');
});

afterEach(async () => {
  await testPool.end();
  vi.clearAllMocks();
});

describe("GET /user", () => {
  it("should return a user given an email in the query", async () => {
    const mockQuery = testPool.query as Mock;
    const email = "johndoe@gmail.com";
    mockQuery.mockResolvedValueOnce({ rows: [{ email }] });

    const res = await request(app).get("/user").query({ email: email });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("email", email);
  });

  it("should return an error if there is no user that corresponds to that email", async () => {
    const queryEmail = "john@gmail.com";

    const res = await request(app).get("/user").query({ email: queryEmail });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
    expect(res.body).toHaveProperty("message");
  });

  it("should return an error if no email is provided", async () => {
    const res = await request(app).get("/user");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
    expect(res.body).toHaveProperty("message");
  });
});

describe("POST /user", () => {
  it("should create a user given a username and email", async () => {
    const mockPool = new Pool();
    const mockQuery = mockPool.query as Mock;
    const username = "johndoe";
    const email = "johndoe@gmail.com";
    mockQuery.mockResolvedValueOnce({ rows: [{ username, email }] });

    const res = await request(app).post("/user").send({ username, email });

    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("email", email);
    expect(res.body.data).toHaveProperty("username", username);
  });
});
