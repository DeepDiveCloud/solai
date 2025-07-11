const express = require("express");
const router = express.Router();
const db = require("../models/db"); // mysql2/promise pool

// ✅ Get Total Greens Weight
router.get("/totalgreens", async (req, res) => {
    try {
        const [results] = await db.query('SELECT SUM(total_dc_weight) AS totalGreens FROM greens_arrival');
        res.json({ totalGreens: results[0]?.totalGreens || 0 });
    } catch (error) {
        console.error("❌ Database Query Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ✅ Get Total Greens Price
router.get("/totalgreensprice", async (req, res) => {
    try {
        const [results] = await db.query('SELECT SUM(dc_total_greens_amount) AS totalGreensprice FROM greens_arrival');
        res.json({ totalGreensprice: results[0]?.totalGreensprice || 0 });
    } catch (error) {
        console.error("❌ Database Query Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;
