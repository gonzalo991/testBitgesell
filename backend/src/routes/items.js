const express = require('express');
const fs = require('fs').promises; // used a modern approach to use async functions with fs
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data (intentionally sync to highlight blocking issue)
async function readData() { // I have changed this to an async function to read files asynchronously
  // Used try/catch block to handle errors properly
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8"); // I have changed the readFileSync to async function readFile
    return JSON.parse(raw);
  } catch (error) {
    console.error(`There was an error reading file: ${error}`);
    throw new Error(`Failed to read or parse data: ${error.message}`);
  }
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData(); // i needed to use await here to handle data in the correct way
    const { limit, q } = req.query;
    let results = data;

    if (q) {
      // Simple substring search (sub‑optimal)
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    if (limit) {
      results = results.slice(0, parseInt(limit));
    }

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = await data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;