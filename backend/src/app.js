const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const { getCookie, notFound } = require('./middleware/errorHandler');
const itemsRouter = require("./routes/items");
const statsRouter = require("./routes/stats");

getCookie();

// Enable CORS for frontend
app.use(cors({ origin: 'http://localhost:3000' }));

// Basic middleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use("/api/items", itemsRouter);
app.use("/api/stats", statsRouter);

// Catch-all 404
app.use('*', notFound);

module.exports = app;