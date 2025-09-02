const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db"); // your MySQL pool/connection
const { authenticateToken } = require("../middleware/authenticateToken");

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // Fetch user
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    // JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        super_admin: user.super_admin === 1
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Get assigned_url if not super_admin
    let assigned_url = null;
    if (!user.super_admin) {
      const [groupRows] = await db.query(
        `SELECT g.assigned_url
         FROM user_groups ug
         JOIN \`groups\` g ON ug.group_id = g.id
         WHERE ug.user_id = ?`,
        [user.id]
      );
      if (groupRows.length) assigned_url = groupRows[0].assigned_url;
    }

    res.json({ token, role: user.role, super_admin: user.super_admin === 1, assigned_url });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login verification for token
router.get("/verify", authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Assign default for super_admin
    const assigned_url = user.super_admin ? "ALL_PAGES_ACCESS" : user.assigned_url || null;

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      super_admin: user.super_admin,
      assigned_url,
    });
  } catch (err) {
    console.error("Verify failed:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
