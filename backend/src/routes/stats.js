const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');

// Variables to cache status
let cachedStats = null; // this will save the object with the calculated statistics
let lastCalculationStats = 0; // This will save the last time the data has been calculated
const CACHE_DURATION_MS = 10 * 60 * 1000; // Time interval for calculation

// function to calculate stats and make it reusable
const calculateStats = (items) => {
  const total = items.length;
  const averagePrice = items.reduce((acc, cur) => acc + cur.price, 0) / items.length;
  return { total, averagePrice };
}

// GET /api/stats
router.get('/', (req, res, next) => {
  const now = Date.now();

  if (cachedStats && (now - lastCalculationStats) < CACHE_DURATION_MS) {
    console.log(`Serving cache stats: ${cachedStats}`);
    return res.json(cachedStats);
  }

  console.log(`Expired Cache or it does not exists. Recalculating...`);

  try {
    fs.readFile(DATA_PATH, (err, raw) => {
      if (err) return next(err);

      const items = JSON.parse(raw);
      // Intentional heavy CPU calculation
      const stats = calculateStats(items);
      return stats;
    });
    // We updated the schedule at which the stats were calculated
    lastCalculationStats = Date.now();
    res.json(cachedStats) // Return the new value of the operation
  } catch (error) {
    next(error);
  }
});

module.exports = router;