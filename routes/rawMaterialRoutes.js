const express = require("express");
const router = express.Router();
const db = require("../models/db"); // mysql2/promise connection

router.post("/raw-material", async (req, res) => {
    const {
        invoice_date,
        invoice_no,
        supplier_name,
        product,
        quantity,
        amount,
        totalAmount
    } = req.body;

    console.log("Received body:", req.body);

    if (!invoice_date || !invoice_no || !supplier_name || !Array.isArray(product)) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        for (let i = 0; i < product.length; i++) {
            const sql = `
                INSERT INTO raw_material_purchases 
                (invoice_date, invoice_no, supplier_name, product, quantity, rate, total_amount) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                invoice_date,
                invoice_no,
                supplier_name,
                product[i],
                quantity[i],
                amount[i],
                totalAmount[i]
            ];
            await conn.query(sql, values);
        }

        await conn.commit();
        res.json({ success: true });
    } catch (error) {
        await conn.rollback();
        console.error("Insert Error:", error);
        res.status(500).json({ success: false, error: "Database error" });
    } finally {
        conn.release();
    }
});

// GET all raw material purchases
router.get("/raw-material", async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT invoice_date, invoice_no, supplier_name, product, quantity, rate, total_amount 
       FROM raw_material_purchases 
       ORDER BY invoice_date DESC`
    );
    res.json(results);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


module.exports = router;
