import request from "supertest";
import { app } from "../../index";

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { Pool } from "pg";
import { Category } from "../../utils/types";

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
    const mockQuery = testPool.query as Mock;
    const queryEmail = "john@gmail.com";
    mockQuery.mockRejectedValue(new Error("An error has occured"));

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
    const mockQuery = testPool.query as Mock;
    const username = "johndoe";
    const email = "johndoe@gmail.com";
    mockQuery.mockResolvedValueOnce({ rows: [{ username, email }] });

    const res = await request(app).post("/user").send({ username, email });

    // expect pool.query to be called with the correct query
    expect(mockQuery).toHaveBeenCalledWith(
      `INSERT INTO "User"(username, email) VALUES ($1, $2) RETURNING *`,
      [username, email]
    );
    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("email", email);
    expect(res.body.data).toHaveProperty("username", username);
  });

  it("should return an error if no username or email is provided", async () => {
    const response = await request(app).post("/user").send({});

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /user/:id/categories", () => {
  it("should get all the categories given a user id", async () => {
    const resolvedCategories: Category[] = [
      {
        category_id: 1,
        user_id: 1,
        category_name: "Category 1",
        category_color: "#000000",
        description: "",
        amount_left: 100,
        amount_spent: 100,
        budget: 200,
      },
    ];
    const mockQuery = testPool.query as Mock;
    const id = 1;
    mockQuery.mockResolvedValueOnce({ rows: resolvedCategories });

    const res = await request(app).get(`/user/${id}/categories`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(resolvedCategories);
  });

  it("should return an empty list if no categories are found", async () => {
    const mockQuery = testPool.query as Mock;
    const id = 1;
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get(`/user/${id}/categories`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual([]);
  });
});
