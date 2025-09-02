const db = require("../models/db");

// ✅ Get all users
const getUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Create user
const createUser = (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: "All fields required" });
  }
  db.query(
    "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
    [name, email, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, email, role });
    }
  );
};

// ✅ Update user
const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  db.query(
    "UPDATE users SET name=?, email=?, role=? WHERE id=?",
    [name, email, role, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User updated successfully" });
    }
  );
};

// ✅ Delete user
const deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
