const express = require("express");
const db = require("../models/db");

const router = express.Router();

// Assign permissions to a user
router.post("/assign", (req, res) => {
    const { user_id, page, can_view, can_edit, can_delete } = req.body;

    db.query(
        "INSERT INTO permissions (user_id, page, can_view, can_edit, can_delete) VALUES (?, ?, ?, ?, ?)",
        [user_id, page, can_view, can_edit, can_delete],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Database error", details: err });
            res.json({ message: "Permissions assigned successfully!" });
        }
    );
});

// Get permissions for a user
router.get("/:user_id", (req, res) => {
    const { user_id } = req.params;

    db.query("SELECT * FROM permissions WHERE user_id = ?", [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

module.exports = router;
