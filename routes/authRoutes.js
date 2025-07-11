const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");  // ✅ Make sure this is correct

const router = express.Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;
// Check if email exists in database
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Database query error:", err);  // ✅ Debugging log
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) return res.status(401).json({ error: "User not found" });

        const user = results[0];
// Compare hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Error checking password" });
            if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
// Generate JWT Token
            const token = jwt.sign({ id: user.id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" });
            res.json({
                message: "Login successful",
                token: token,
                role: user.role
            });
        });
    });
});
router.get("/verify", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "your_jwt_secret");
        res.json({ role: decoded.role });
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
});
module.exports = router;
