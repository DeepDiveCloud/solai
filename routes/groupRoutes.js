const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ✅ Get all groups
router.get("/groups", async (req, res) => {
  try {
    const [groups] = await db.query("SELECT id, name FROM `groups`");
    res.json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Attach user to group
router.post("/user-group", async (req, res) => {
  const { userId, groupId } = req.body;
  if (!userId || !groupId) {
    return res.status(400).json({ error: "userId and groupId required" });
  }

  try {
    // Prevent duplicates
    const [existing] = await db.query(
      "SELECT * FROM user_groups WHERE user_id = ? AND group_id = ?",
      [userId, groupId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "User already in group" });
    }

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
// ✅ Get groups for a specific user
router.get('/user-groups/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.query(
      `SELECT g.id, g.name 
       FROM user_groups ug
       JOIN \`groups\` g ON ug.group_id = g.id
       WHERE ug.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ error: 'Failed to fetch user groups' });
  }
});
// ✅ Remove user from group
router.delete("/user-group/:userId/:groupId", async (req, res) => {
  const { userId, groupId } = req.params;

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
