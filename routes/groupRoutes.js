const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Helper to validate integer IDs
function isValidId(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

// ✅ Get all groups with assigned_url
router.get("/groups", async (req, res) => {
  try {
    const [groups] = await db.query("SELECT id, name, assigned_url FROM `groups`");
    res.json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Attach user to group with validation and existence checks
router.post("/user-group", async (req, res) => {
  const { userId, groupId } = req.body;

  if (!isValidId(userId) || !isValidId(groupId)) {
    return res.status(400).json({ error: "Invalid userId or groupId" });
  }

  try {
    // Check user exists
    const [userCheck] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check group exists
    const [groupCheck] = await db.query("SELECT id FROM `groups` WHERE id = ?", [groupId]);
    if (groupCheck.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Prevent duplicates
    const [existing] = await db.query(
      "SELECT * FROM user_groups WHERE user_id = ? AND group_id = ?",
      [userId, groupId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "User already in group" });
    }

    // Insert relation
    await db.query(
      "INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)",
      [userId, groupId]
    );

    res.json({ message: "User attached to group successfully" });
  } catch (err) {
    console.error("Attach error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get groups assigned to a specific user, with validation
router.get("/user-groups/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!isValidId(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const [rows] = await db.query(
      `SELECT g.id, g.name, g.assigned_url
       FROM user_groups ug
       JOIN \`groups\` g ON ug.group_id = g.id
       WHERE ug.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ error: "Failed to fetch user groups" });
  }
});

// ✅ Remove user from group with validation
router.delete("/user-group/:userId/:groupId", async (req, res) => {
  const { userId, groupId } = req.params;

  if (!isValidId(userId) || !isValidId(groupId)) {
    return res.status(400).json({ error: "Invalid userId or groupId" });
  }

  try {
    const [result] = await db.query(
      "DELETE FROM user_groups WHERE user_id = ? AND group_id = ?",
      [userId, groupId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User is not assigned to this group" });
    }

    res.json({ message: "Group detached successfully" });
  } catch (err) {
    console.error("Detach error:", err);
    res.status(500).json({ error: "Server error while detaching group" });
  }
});

module.exports = router;
