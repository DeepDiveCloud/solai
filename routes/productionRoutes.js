const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Save Production Entry
router.post("/production", async (req, res) => {
  try {
    let { productionDate, dcWeight, factoryWeight, acid, vinegar, brine, wastage } = req.body;

    // Ensure arrays are stringified before saving
    acid = JSON.stringify(acid || []);
    vinegar = JSON.stringify(vinegar || []);
    brine = JSON.stringify(brine || []);

    const [result] = await db.query(
      `INSERT INTO production 
       (productionDate, dcWeight, factoryWeight, acid, vinegar, brine, wastage) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [productionDate, dcWeight, factoryWeight, acid, vinegar, brine, wastage]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Error saving production:", err);
    res.status(500).json({ error: "Failed to save production entry" });
  }
});

// Get Production Entries
router.get("/production", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM production ORDER BY id DESC");

    // Parse JSON fields back into objects
    const formatted = rows.map((row) => ({
      ...row,
      acid: row.acid ? JSON.parse(row.acid) : [],
      vinegar: row.vinegar ? JSON.parse(row.vinegar) : [],
      brine: row.brine ? JSON.parse(row.brine) : [],
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching production:", err);
    res.status(500).json({ error: "Failed to fetch production entries" });
  }
});

// Update Production Entry
router.put("/production/:id", async (req, res) => {
  try {
    let { productionDate, dcWeight, factoryWeight, acid, vinegar, brine, wastage } = req.body;

    acid = JSON.stringify(acid || []);
    vinegar = JSON.stringify(vinegar || []);
    brine = JSON.stringify(brine || []);

    await db.query(
      `UPDATE production SET productionDate=?, dcWeight=?, factoryWeight=?, acid=?, vinegar=?, brine=?, wastage=? WHERE id=?`,
      [productionDate, dcWeight, factoryWeight, acid, vinegar, brine, wastage, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating production:", err);
    res.status(500).json({ error: "Failed to update production entry" });
  }
});

module.exports = router;
