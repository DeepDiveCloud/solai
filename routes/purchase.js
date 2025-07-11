const express = require("express");
const router = express.Router();
const db = require("../models/db"); // Ensure this points to your MySQL connection

router.post("/purchase-entry", async (req, res) => {
    const { invoice_date, invoice_no, supplier_name, items } = req.body;
  
    if (!invoice_date || !invoice_no || !supplier_name || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
  
      // Insert main purchase
      const [purchaseResult] = await conn.execute(
        `INSERT INTO purchases (invoice_date, invoice_no, supplier_name)
         VALUES (?, ?, ?)`,
        [invoice_date, invoice_no, supplier_name]
      );
      const purchaseId = purchaseResult.insertId;
  
      // Insert items
      const itemQueries = items.map(item =>
        conn.execute(
          `INSERT INTO purchase_items (purchase_id, product, quantity, amount)
           VALUES (?, ?, ?, ?)`,
          [purchaseId, item.product, item.quantity, item.amount]
        )
      );
      await Promise.all(itemQueries);
  
      await conn.commit();
      res.json({ message: 'Purchase entry saved successfully' });
    } catch (error) {
      await conn.rollback();
      console.error(error);
      res.status(500).json({ message: 'Failed to save purchase entry' });
    } finally {
      conn.release();
    }
  });


  
  
  module.exports = router;
