const express = require("express");
const bcrypt  = require("bcrypt");
const db      = require("../models/db"); // promisified pool.query
const router  = express.Router();

// — 1) List users — GET /api/users
router.get("/users", async (req, res) => {
  try {
    const rows = await db.query("SELECT id, name, email, role FROM users");
    res.json(rows);
  } catch (err) {
    console.error("GET /api/users error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// — 2) Create user — POST /api/users
router.post("/users", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name, email, hash, role]
    );
    res.status(201).json({ message: "User created", id: result.insertId });
  } catch (err) {
    console.error("POST /api/users error:", err);
    res.status(500).json({ error: "Error creating user" });
  }
});

// — 3) Delete user — DELETE /api/users/:id
router.delete("/users:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE /api/users/:id error:", err);
    res.status(500).json({ error: "Error deleting user" });
  }
});

// — 4) List groups — GET /api/groups
router.get("/groups", async (req, res) => {
  try {
    // Use backticks to escape reserved keyword
    const rows = await db.query("SELECT id, name FROM user_groups");
    res.json(rows);
  } catch (err) {
    console.error("GET /api/groups error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// — 5) Attach user to group — POST /api/user-group
router.post("/user-group", async (req, res) => {
  const { userId, groupId } = req.body;
  if (!userId || !groupId) {
    return res.status(400).json({ error: "userId and groupId required" });
  }
  try {
    await db.query(
      "INSERT INTO user_group_mapping (user_id, group_id) VALUES (?, ?)",
      [userId, groupId]
    );
    res.json({ message: "User attached to group" });
  } catch (err) {
    console.error("POST /api/user-group error:", err);
    res.status(500).json({ error: "Error attaching user to group" });
  }
});

module.exports = router;
