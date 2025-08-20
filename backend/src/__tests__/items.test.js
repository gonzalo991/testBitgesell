// backend/src/__tests__/items.test.js
const request = require("supertest");
const path = require("path");
const fs = require("fs/promises");
const app = require("../app");


const DATA_PATH = path.join(__dirname, "../../../data/items.json");

describe("Items API", () => {
  it("GET /api/items -> should return all items", async () => {
    const res = await request(app).get("/api/items");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /api/items?q=laptop -> should filter by query", async () => {
    const res = await request(app).get("/api/items?q=laptop");
    expect(res.status).toBe(200);
    expect(res.body[0].name).toMatch("Laptop Pro");
  });

  it("GET /api/items/:id -> should return 404 if not found", async () => {
    const res = await request(app).get("/api/items/9999");
    expect(res.status).toBe(404);
  });

  it("POST /api/items -> should create a new item", async () => {
    const newItem = { name: "Mechanical Keyboard", category: "Electronics", price: 199 };

    const res = await request(app).post("/api/items").send(newItem);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");

    // Check if file is updated
    const fileData = await fs.readFile(DATA_PATH, "utf-8");
    const items = JSON.parse(fileData);
    expect(items.some((i) => i.name === "Mechanical Keyboard")).toBe(true);
  });

});