const express = require("express");
const router = express.Router();
const db = require("../models/db");
const { authenticateToken } = require("../middleware/authenticateToken");

// ✅ /api/totalgreens (PROTECTED)
router.get("/totalgreens", authenticateToken, async (req, res) => {
  console.log("🔐 Authenticated request by:", req.user);

  try {
    const [rows] = await db.query("SELECT SUM(total_dc_weight) AS totalGreens FROM greens_arrival");
    res.json({ totalGreens: rows[0].totalGreens || 0 });
  } catch (err) {
    console.error("❌ DB error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});
// ✅ /api/totalgreensprice (PROTECTED)
router.get("/totalgreensprice", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        SUM(F_total_greens_amount) AS totalFactoryAmount,
        SUM(dc_total_greens_amount) AS totalDCAmt
      FROM greens_arrival
    `);

    const totalFactoryAmount = rows[0].totalFactoryAmount || 0;
    const totalDCAmt = rows[0].totalDCAmt || 0;

    res.json({
      totalFactoryAmount: Number(totalFactoryAmount),
      totalDCAmt: Number(totalDCAmt),
      grandTotal: Number(totalFactoryAmount) + Number(totalDCAmt),
    });
  } catch (err) {
    console.error("❌ DB error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});




// ✅ /api/production-summary (PROTECTED)
router.get("/production-summary", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        (SELECT IFNULL(SUM(j.value),0)
         FROM production,
              JSON_TABLE(acetic_acid, '$[*]'
                COLUMNS(value DECIMAL(10,2) PATH '$.value')
              ) AS j
        ) AS acidTotal,
        
        (SELECT IFNULL(SUM(j.value),0)
         FROM production,
              JSON_TABLE(vinegar, '$[*]'
                COLUMNS(value DECIMAL(10,2) PATH '$.value')
              ) AS j
        ) AS vinegarTotal,
        
        (SELECT IFNULL(SUM(j.value),0)
         FROM production,
              JSON_TABLE(brine, '$[*]'
                COLUMNS(value DECIMAL(10,2) PATH '$.value')
              ) AS j
        ) AS brineTotal
    `);

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Production summary error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});



module.exports = router;
