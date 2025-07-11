const express = require("express");
const router = express.Router();
const db = require("../models/db"); // mysql2/promise

// ✅ Add new vendor price with season
router.post("/add", async (req, res) => {
    const {
        season_name,
        from_date,
        to_date,
        vendor_name,
        pattern,
        price_160_plus,
        price_100_plus,
        price_30_plus,
        price_30_minus
    } = req.body;

    if (
        !season_name || !from_date || !to_date || !vendor_name || !pattern ||
        !price_160_plus || !price_100_plus || !price_30_plus || !price_30_minus
    ) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!Date.parse(from_date) || !Date.parse(to_date)) {
        return res.status(400).json({ error: "Invalid date format" });
    }

    const query = `
        INSERT INTO vendor_prices 
        (season_name, from_date, to_date, vendor_name, pattern, 
         price_160_plus, price_100_plus, price_30_plus, price_30_minus) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const [result] = await db.query(query, [
            season_name,
            from_date,
            to_date,
            vendor_name,
            pattern,
            price_160_plus,
            price_100_plus,
            price_30_plus,
            price_30_minus
        ]);
        res.json({ message: "Vendor price added successfully", id: result.insertId });
    } catch (err) {
        console.error("Error inserting vendor price:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ Fetch all vendor prices
router.get("/prices", async (req, res) => {
    const query = `
        SELECT id, season_name, 
        DATE_FORMAT(from_date, '%Y-%m-%d') AS from_date, 
        DATE_FORMAT(to_date, '%Y-%m-%d') AS to_date, 
        vendor_name, pattern, price_160_plus, price_100_plus, price_30_plus, price_30_minus 
        FROM vendor_prices`;

    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error("Error fetching vendor prices:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ Delete vendor price
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM vendor_prices WHERE id = ?";

    try {
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Vendor price not found" });
        }

        res.json({ message: "Vendor price deleted successfully" });
    } catch (err) {
        console.error("Error deleting vendor price:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ Get Patterns Based on Entry Date & Vendor
router.get("/patterns/by-date-vendor", async (req, res) => {
    const { entry_date, vendor_name } = req.query;

    if (!entry_date || !vendor_name) {
        return res.status(400).json({ error: "Entry date and Vendor name are required" });
    }

    const query = `
        SELECT DISTINCT pattern 
        FROM vendor_prices 
        WHERE from_date <= ? AND to_date >= ? 
        AND vendor_name = ?`;

    try {
        const [results] = await db.query(query, [entry_date, entry_date, vendor_name]);
        res.json(results);
    } catch (err) {
        console.error("Error fetching patterns:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ Get all unique vendor names
router.get("/vendors", async (req, res) => {
    const query = "SELECT DISTINCT vendor_name FROM vendor_prices ORDER BY vendor_name ASC";

    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error("Error fetching vendors:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
