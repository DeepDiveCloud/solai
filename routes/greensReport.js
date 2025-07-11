const express = require("express");
const router = express.Router();
const db = require("../models/db"); // Ensure your DB connection is properly imported

// ✅ Greens Status Report API
router.get("/greens/status", async (req, res) => {
    const { vendor, location, dateFrom, dateTo } = req.query;

    let query = `SELECT 
        COALESCE(SUM(totalDCWeight), 0) AS totalDCWeight, 
        COALESCE(SUM(totalFactoryWeight), 0) AS totalFactoryWeight, 
        COALESCE(SUM(shortageExcess), 0) AS totalShortage,
        COALESCE(SUM(plus160), 0) AS total160plus, 
        COALESCE(SUM(plus100), 0) AS total100plus, 
        COALESCE(SUM(plus30), 0) AS total30plus, 
        COALESCE(SUM(minus30), 0) AS total30minus 
    FROM greens_entry WHERE 1=1`;

    const queryParams = [];

    if (vendor) {
        query += " AND vendor = ?";
        queryParams.push(vendor);
    }
    if (location) {
        query += " AND location = ?";
        queryParams.push(location);
    }
    if (dateFrom && dateTo) {
        query += " AND factoryArrivalDate BETWEEN ? AND ?";
        queryParams.push(dateFrom, dateTo);
    }

    try {
        const [results] = await db.query(query, queryParams);

        if (!results || results.length === 0 || !results[0]) {
            return res.json({
                totalDCWeight: 0,
                totalFactoryWeight: 0,
                totalShortage: 0,
                total160plus: 0,
                total100plus: 0,
                total30plus: 0,
                total30minus: 0
            });
        }

        res.json(results[0]);
    } catch (err) {
        console.error("❌ Database query error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ Get Distinct Vendors
router.get("/greens/vendors", async (req, res) => {
    try {
        const [results] = await db.query("SELECT DISTINCT vendor FROM greens_entry WHERE vendor IS NOT NULL ORDER BY vendor ASC");
        res.json(results.map(row => row.vendor));
    } catch (err) {
        console.error("❌ Database query error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ Get Distinct Locations
router.get("/greens/locations", async (req, res) => {
    try {
        const [results] = await db.query("SELECT DISTINCT location FROM greens_entry ORDER BY location ASC");
        res.json(results.map(row => row.location));
    } catch (err) {
        console.error("❌ Database query error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
