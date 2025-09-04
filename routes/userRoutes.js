const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models/db");

// ⬅️ Import both middlewares properly
const { authenticateToken, authorizeRoles } = require("../middleware/authenticateToken");

// 🔹 Create a new user (only super_admin can create users)
router.post("/users", authenticateToken, authorizeRoles("super_admin"), async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role, super_admin, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [name, email, hashedPassword, role, role === "super_admin" ? 1 : 0]
    );

    res.status(201).json({ message: "User created successfully", userId: result.insertId });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all users
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, role FROM users");
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
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
    console.error("❌ Delete user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
