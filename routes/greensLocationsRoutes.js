const express = require('express');
const router = express.Router();
const db = require('../models/db'); // uses mysql2/promise

// ✅ Get all greens locations
router.get('/greens-locations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM greens_locations ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching greens locations:', err.message);
    res.status(500).json({ error: 'Database error', message: err.message });
  }
});

// ✅ Add a new greens location
router.post('/greens-locations', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    await db.query('INSERT INTO greens_locations (name) VALUES (?)', [name.trim()]);
    res.json({ message: 'Greens location added successfully' });
  } catch (err) {
    console.error('Error adding greens location:', err.message);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ✅ Delete a greens location
router.delete('/greens-locations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM greens_locations WHERE id = ?', [id]);
    res.json({ message: 'Greens location deleted successfully' });
  } catch (err) {
    console.error('Error deleting greens location:', err.message);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

module.exports = router;
