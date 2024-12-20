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
let mockQuery: Mock;

beforeEach(async () => {
  testPool = new Pool();
  mockQuery = testPool.query as Mock;
});

afterEach(async () => {
  await testPool.end();
  vi.restoreAllMocks();
});

describe("POST /category", () => {
  it("should create a new category", async () => {
    const category: Category = {
      budget: 1000,
      category_color: "red",
      category_name: "Food",
      user_id: 1,
      description: "Food expenses",
      amount_left: 1000,
      amount_spent: 0,
    };
    mockQuery.mockResolvedValue({ rows: [category] });

    const res = await request(app).post("/category").send(category);
    expect(mockQuery).toHaveBeenCalledWith(
      `INSERT INTO "Category" (
        budget,
        category_color,
        category_name,
        user_id,
        description,
        amount_left,
        amount_spent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [
        category.budget,
        category.category_color,
        category.category_name,
        category.user_id,
        category.description,
        category.amount_left,
        category.amount_spent,
      ]
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty(
      "category_name",
      category.category_name
    );
  });

  it("should not create a category when the name and budget is not found", async () => {
    const category = {
      budget: 1000,
      category_color: "red",
      category_name: "Food",
      user_id: 1,
      description: "Food expenses",
      amount_left: 1000,
      amount_spent: 0,
    };
    mockQuery.mockRejectedValue(
      new Error("Category name and budget is required")
    );

    const res = await request(app).post("/category").send(category);

    console.log(res.body);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
    expect(res.body).toHaveProperty("message");
  });

  it("should not create a category when the user_id is not found", async () => {
    const category = {
      budget: 1000,
      category_color: "red",
      category_name: "Food",
      description: "Food expenses",
      amount_left: 1000,
      amount_spent: 0,
    };
    mockQuery.mockRejectedValue(new Error("User id is required"));

    const res = await request(app).post("/category").send(category);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
    expect(res.body).toHaveProperty("message");
  });
});

describe("GET /category/:id", () => {
  it("should get the category based on the id", async () => {
    const categoryId = "2";

    const category: Category = {
      budget: 1000,
      category_color: "red",
      category_name: "Food",
      user_id: 1,
      description: "Food expenses",
      amount_left: 1000,
      amount_spent: 0,
      category_id: Number(categoryId),
    };

    mockQuery.mockResolvedValue({ rows: [category] });

    const res = await request(app).get(`/category/${categoryId}`);
    console.log(res.body);
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT * FROM "Category" WHERE category_id = $1',
      [categoryId]
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("category_id", Number(categoryId));
  });

  it("should avoid SQL injection", async () => {
    const categoryId = '2; DROP TABLE "Category";';
    mockQuery.mockResolvedValue({ rows: [] });

    const res = await request(app).get(`/category/${categoryId}`);
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT * FROM "Category" WHERE category_id = $1',
      [categoryId]
    );

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
    expect(res.body).toHaveProperty("message");
  });

  it("should return an error when the category is not found", async () => {
    const categoryId = "2";

    mockQuery.mockResolvedValue({ rows: [] });

    const res = await request(app).get(`/category/${categoryId}`);
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT * FROM "Category" WHERE category_id = $1',
      [categoryId]
    );
    console.log(res.body);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
    expect(res.body).toHaveProperty("message");
  });
});
