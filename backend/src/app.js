const express = require("express");
const itemsRouter = require("./routes/items");
const statsRouter = require("./routes/stats");

const app = express();
app.use(express.json());
app.use("/api/items", itemsRouter);
app.use("/api/stats", statsRouter);

module.exports = app;