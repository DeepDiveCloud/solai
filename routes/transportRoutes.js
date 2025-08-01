const express = require("express");
const router = express.Router();
const db = require("../models/db"); // mysql2/promise connection

// ✅ Add new transport price
router.post("/Transport-add", async (req, res) => {
    const { season_name, transport_name, location, price } = req.body;

    if (!season_name || !transport_name || !location || !price) {
        return res.status(400).json({ error: "⚠️ All fields are required!" });
    }

    const query = `INSERT INTO transport_prices (season_name, transport_name, location, price) VALUES (?, ?, ?, ?)`;

    try {
        const [result] = await db.query(query, [season_name, transport_name, location, price]);
        res.json({ message: "✅ Transport price added successfully", id: result.insertId });
    } catch (err) {
        console.error("❌ Error inserting Transport price:", err.sqlMessage || err);
        res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }
});

// ✅ Fetch all transport prices
router.get("/Transport-prices", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM transport_prices");
        res.json(results);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ DELETE Transport Price
router.delete("/transport-delete/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Transport price ID is required" });
    }

    const query = "DELETE FROM transport_prices WHERE id = ?";

    try {
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Transport price not found", id });
        }

        res.json({ message: "Transport price deleted successfully", deletedId: id });
    } catch (err) {
        console.error("Error deleting transport price:", err.sqlMessage || err);
        res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }
});

// ✅ Get distinct season names
router.get("/seasons/all", async (req, res) => {
    try {
        const [results] = await db.query("SELECT DISTINCT season_name FROM vendor_prices");
        res.json(results);
    } catch (err) {
        console.error("❌ Error fetching seasons:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ Get transport locations from the 'locations' table
router.get("/locations", async (req, res) => {
    const query = `
        SELECT DISTINCT location_name AS location 
        FROM locations 
        ORDER BY location_name ASC
    `;

    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error("Error fetching locations:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ Get transport price by location_id and vehicle_type
router.get("/Transport-prices", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM transport_prices");
        res.json(results);
    } catch (err) {
        console.error("❌ Database error in /Transport-prices:", err);
        res.status(500).json({ error: "Database error" });
    }
});


module.exports = router;
