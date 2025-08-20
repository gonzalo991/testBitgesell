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
    const { limit = 5, page = 1, q } = req.query; // Added page param
    let results = data;

    if (q) {
      // Simple substring search (sub‑optimal)
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }
    

   const startIndex = (parseInt(page) -1) * parseInt(limit); // pagination starts
   const endIndex = startIndex + parseInt(limit);
   const paginated = results.slice(startIndex, endIndex); //  get slice of data

    res.status(200).json({
      total: results.length, // total items after filtering
      page: parseInt(page), // current page
      limit: parseInt(limit), // page size
      data: paginated // it just returns the slice
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
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

    if (!item.name || !item.price)
      return res.status(400).json({ error: "Missing required fields: name, price." })

    const data = await readData();
    item.id = Date.now();
    data.push(item);

    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

 // -------------------- Added methods to update and delete
// PATCH /api/items/:id (toggle active)
router.patch('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const index = data.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) {
      const err = new Error("Item not found");
      err.status = 404;
      throw err;
    }

    // Actualizar active (si existe en el body)
    if (req.body.active !== undefined) {
      data[index].active = req.body.active;
    }

    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    res.json(data[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/items/:id
router.delete('/:id', async (req, res, next) => {
  try {
    let data = await readData();
    const itemId = parseInt(req.params.id);

    const index = data.findIndex(item => item.id === itemId);
    if (index === -1) {
      return res.status(404).json({ error: 'Item no found' });
    }

    // Eliminar el item
    const deletedItem = data[index];
    data.splice(index, 1);

    await writeData(data);
    res.json({ message: 'Item deleted successfylly.', deletedItem });
  } catch (err) {
    next(err);
  }
});

module.exports = router;