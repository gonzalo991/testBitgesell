// backend/src/__tests__/stats.test.js
const request = require("supertest");
const path = require("path");
const fs = require("fs/promises");
const app = require("../app");

const DATA_PATH = path.join(__dirname, "../../../data/items.json");


describe("Stats API", ()=> {
    it("GET /api/stats -> should return total and averagePrice", async () => {
        const res = await request(app).get("/api/stats");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("total");
        expect(res.body).toHaveProperty("averagePrice");
        expect(typeof res.body.averagePrice).toBe("number");
    });

    it("GET /api/stats -> should serve cached result on second call", async () => {
        const first = await request(app).get("/api/stats");
        const second = await request(app).get("/api/stats");

        expect(second.body).toEqual(first.body);
    });
});