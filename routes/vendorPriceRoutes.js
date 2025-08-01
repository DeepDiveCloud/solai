const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ✅ Fetch all vendor prices
router.get("/prices", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM vendor_prices ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Add new vendor price
router.post("/add", async (req, res) => {
  const {
    season_name, from_date, to_date, vendor_name,
    greens_location, greens_pattern,
    price_160_plus, price_100_plus, price_60_plus,
    price_30_plus, price_30_minus
  } = req.body;

  try {
    await db.query(
      `INSERT INTO vendor_prices 
       (season_name, from_date, to_date, vendor_name, greens_location, greens_pattern,
        price_160_plus, price_100_plus, price_60_plus, price_30_plus, price_30_minus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [season_name, from_date, to_date, vendor_name, greens_location, greens_pattern,
        price_160_plus, price_100_plus, price_60_plus, price_30_plus, price_30_minus]
    );
    res.status(201).json({ message: "Vendor price added" });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "Insert failed" });
  }
});

// ✅ Delete vendor price
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM vendor_prices WHERE id = ?", [id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// ✅ Get vendor names based on date
router.get("/vendors/by-date", async (req, res) => {
  const { entry_date } = req.query;

  if (!entry_date) return res.status(400).json({ error: "entry_date is required" });

  try {
    const [vendors] = await db.query(`
      SELECT DISTINCT vendor_name
      FROM vendor_prices
      WHERE ? BETWEEN from_date AND to_date
    `, [entry_date]);

    res.json(vendors);
  } catch (err) {
    console.error("Error fetching vendors by date:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Get greens patterns based on vendor and date
router.get("/patterns", async (req, res) => {
  const { date, vendor } = req.query;

  if (!date || !vendor) return res.status(400).json({ error: "Date and vendor required" });

  try {
    const [rows] = await db.query(`
      SELECT DISTINCT greens_pattern AS pattern
      FROM vendor_prices
      WHERE vendor_name = ? AND ? BETWEEN from_date AND to_date
    `, [vendor, date]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching patterns:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Get greens locations based on vendor and date
router.get("/vendor/locations", async (req, res) => {
  const { vendor, date } = req.query;

  if (!vendor || !date) return res.status(400).json({ error: "vendor and date required" });

  try {
    const [locations] = await db.query(`
      SELECT DISTINCT greens_location
      FROM vendor_prices
      WHERE vendor_name = ? AND ? BETWEEN from_date AND to_date
    `, [vendor, date]);

    res.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
