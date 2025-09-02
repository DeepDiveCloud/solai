const db = require("./db");

const User = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users", (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  create: (username, role) => {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO users (username, role) VALUES (?, ?)",
        [username, role],
        (err, results) => {
          if (err) reject(err);
          else resolve({ id: results.insertId, username, role });
        }
      );
    });
  },

  update: (id, username, role) => {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET username = ?, role = ? WHERE id = ?",
        [username, role, id],
        (err) => {
          if (err) reject(err);
          else resolve({ id, username, role });
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },
};

module.exports = User;
