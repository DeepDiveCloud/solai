const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.post("/customers", async (req, res) => {
  try {
    const { name, address, location, phone, email } = req.body;

    console.log("Received:", req.body); // 🟡 Log incoming data

    const query = "INSERT INTO customers (name, address, location, phone, email) VALUES (?, ?, ?, ?, ?)";
    const result = await db.query(query, [name, address, location, phone, email]); // ✅ RIGHT


    console.log("DB Insert Success:", result);

    res.json({ message: "Customer added successfully" });
  } catch (err) {
    console.error("❌ Database error:", err); // 🔴 Look at this in terminal/log
    res.status(500).json({ error: "Failed to save customer" });
  }
});


router.get("/customers", async (req, res) => {
    try {
      const query = "SELECT * FROM customers ORDER BY id DESC";
      const customers = await db.query(query);
      res.json(customers);
    } catch (err) {
      console.error("❌ Failed to fetch customers:", err);
      res.status(500).json({ error: "Failed to retrieve customers" });
    }
  });
  
  router.delete("/customers/:id", (req, res) => {
    const customerId = req.params.id;
    const query = 'DELETE FROM customers WHERE id = ?';

    db.query(query, [customerId], (err, result) => {
        if (err) {
            console.error('Error deleting customer:', err);
            res.status(500).json({ error: 'Delete failed' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Customer not found' });
        } else {
            res.json({ success: true });
        }
    });
});

module.exports = router;
