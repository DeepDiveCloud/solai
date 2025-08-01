const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ✅ Get all users
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, role FROM users");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Create new user
// POST /api/users
router.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    res.status(201).json({ message: 'User created', id: result.insertId });
  } catch (err) {
    console.error('❌ Error inserting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
